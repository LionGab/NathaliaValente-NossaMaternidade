/**
 * Nossa Maternidade - AI Edge Function (Production-Ready)
 *
 * NathIA: Parceira de bolso da mãe brasileira
 *
 * ARQUITETURA DE PROVIDERS (ordem de prioridade):
 * 1. Gemini 2.5 Flash (DEFAULT) - Rápido, direto, persona estável
 * 2. Claude Sonnet 4.5 (FALLBACK) - Quando Gemini falha
 * 3. OpenAI GPT-4o (ÚLTIMO RECURSO) - Emergência
 *
 * CASOS ESPECIAIS:
 * - Imagens/Ultrassons → Claude Vision (único default)
 * - Perguntas médicas → Gemini + Google Search (grounding)
 *
 * Features:
 * - JWT validation (authenticated users only)
 * - Rate limiting via Upstash Redis (20 req/min por usuário)
 * - Circuit breakers (protege contra cascade failures)
 * - Structured logging & monitoring
 * - Payload caps (prevent abuse)
 * - Fallback chain: Gemini → Claude → OpenAI
 * - Grounding com Google Search (Gemini)
 * - Suporte a imagens (Claude Vision)
 * - Citations extraídas corretamente
 * - CORS restrito
 *
 * @version 2.1.0 - Circuit breakers implementados (2025-12)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.28.0";
import OpenAI from "https://esm.sh/openai@4.89.0";
import { Redis } from "https://esm.sh/@upstash/redis@1.28.0";
import { CircuitBreaker } from "../_shared/circuit-breaker.ts";

// =======================
// STRUCTURED LOGGING
// =======================

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  requestId?: string;
  userId?: string; // Hashed for privacy
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

interface RequestMetrics {
  requestId: string;
  userId: string;
  provider: string;
  model?: string;
  messageCount: number;
  estimatedInputTokens: number;
  actualInputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  latencyMs: number;
  success: boolean;
  fallback: boolean;
  rateLimitSource: "redis" | "memory";
  hasImage: boolean;
  hasGrounding: boolean;
}

// =======================
// CRISIS & SAFETY DETECTION (NathIA v2.0)
// =======================

/**
 * Palavras-chave de CRISE - força uso de Claude (modelo mais seguro)
 * Se qualquer uma for detectada, NÃO usa Gemini
 */
const CRISIS_KEYWORDS = [
  // Ideação suicida
  "suicídio",
  "suicidio",
  "me matar",
  "quero morrer",
  "não quero viver",
  "melhor morta",
  "vou me matar",
  "penso em morrer",
  "acabar com tudo",
  "não aguento mais viver",
  "queria estar morta",
  // Risco ao bebê
  "machucar o bebê",
  "machucar meu filho",
  "machucar minha filha",
  "fazer mal ao bebê",
  "jogar o bebê",
  "sufocar o bebê",
  // Automutilação
  "me cortar",
  "me machucar",
  "me ferir",
  // Desespero extremo
  "não tenho saída",
  "ninguém se importa",
  "sou um peso",
];

/**
 * Frases que NathIA NUNCA deve dizer
 * Se Gemini retornar qualquer uma, reprocessa com Claude
 */
const BLOCKED_PHRASES = [
  // Diagnósticos proibidos
  "você tem depressão",
  "você tem ansiedade",
  "você está com depressão",
  "você está com ansiedade",
  "você sofre de",
  // Prescrições proibidas
  "você precisa",
  "você deve",
  "você tem que",
  "é obrigatório",
  // Dependência emocional
  "eu fico aqui",
  "pode contar comigo sempre",
  "estarei sempre aqui",
  "nunca vou te abandonar",
  // Culpa/pressão
  "seu bebê precisa de você",
  "pense no seu filho",
  "você é egoísta",
  "não pode fazer isso",
];

/**
 * Detecta se mensagem indica crise (requer Claude)
 */
function isCrisis(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_KEYWORDS.some((k) => lower.includes(k));
}

/**
 * Detecta se resposta contém frase bloqueada (requer reprocessamento)
 */
function hasBlockedPhrase(response: string): boolean {
  const lower = response.toLowerCase();
  return BLOCKED_PHRASES.some((p) => lower.includes(p));
}

// =======================
// MESSAGE TYPES
// =======================

interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ApiResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: string;
  grounding?: boolean;
  citations?: string[];
}

interface ImageData {
  base64: string;
  mediaType: string;
}

/**
 * Hash userId for privacy in logs
 * Uses simple hash - sufficient for log anonymization
 */
function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `user_${Math.abs(hash).toString(16).substring(0, 8)}`;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Structured logger - outputs JSON for Supabase Logs / external ingestion
 */
const logger = {
  _log(level: LogLevel, event: string, data?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      ...(data && { data }),
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          code: (error as NodeJS.ErrnoException).code,
        },
      }),
    };

    // Output as JSON for structured logging
    const output = JSON.stringify(entry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  },

  info(event: string, data?: Record<string, unknown>) {
    this._log("info", event, data);
  },

  warn(event: string, data?: Record<string, unknown>) {
    this._log("warn", event, data);
  },

  error(event: string, error: Error, data?: Record<string, unknown>) {
    this._log("error", event, data, error);
  },

  debug(event: string, data?: Record<string, unknown>) {
    this._log("debug", event, data);
  },

  /**
   * Log request metrics (called at end of each request)
   */
  metrics(metrics: RequestMetrics) {
    this._log("info", "request_metrics", {
      requestId: metrics.requestId,
      userId: hashUserId(metrics.userId),
      provider: metrics.provider,
      model: metrics.model,
      messageCount: metrics.messageCount,
      tokens: {
        estimatedInput: metrics.estimatedInputTokens,
        actualInput: metrics.actualInputTokens,
        output: metrics.outputTokens,
        total: metrics.totalTokens,
      },
      latencyMs: metrics.latencyMs,
      success: metrics.success,
      fallback: metrics.fallback,
      rateLimitSource: metrics.rateLimitSource,
      features: {
        hasImage: metrics.hasImage,
        hasGrounding: metrics.hasGrounding,
      },
    });
  },

  /**
   * Log rate limit event
   */
  rateLimit(
    userId: string,
    type: "requests" | "tokens",
    current: number,
    max: number,
    source: "redis" | "memory"
  ) {
    this._log("warn", "rate_limit_exceeded", {
      userId: hashUserId(userId),
      type,
      current,
      max,
      source,
    });
  },

  /**
   * Log provider fallback
   */
  fallback(requestId: string, fromProvider: string, toProvider: string, reason: string) {
    this._log("warn", "provider_fallback", {
      requestId,
      fromProvider,
      toProvider,
      reason,
    });
  },

  /**
   * Log authentication event
   */
  auth(event: "success" | "failure", userId?: string, reason?: string) {
    this._log(event === "success" ? "info" : "warn", `auth_${event}`, {
      ...(userId && { userId: hashUserId(userId) }),
      ...(reason && { reason }),
    });
  },
};

// =======================
// ENV & CLIENTS
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

// Upstash Redis (opcional - fallback para in-memory se não configurado)
const UPSTASH_REDIS_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

// Domínios permitidos (CORS)
const ALLOWED_ORIGINS = [
  "https://nossamaternidade.com.br",
  "https://www.nossamaternidade.com.br",
  "exp://", // Expo Go
  "http://localhost:8081", // Dev local
];

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const openai = new OpenAI({ apiKey: OPENAI_KEY });

// Initialize Redis client (if configured)
let redis: Redis | null = null;
if (UPSTASH_REDIS_URL && UPSTASH_REDIS_TOKEN) {
  try {
    redis = new Redis({
      url: UPSTASH_REDIS_URL,
      token: UPSTASH_REDIS_TOKEN,
    });
    console.log("✅ Upstash Redis initialized");
  } catch (err) {
    console.error("⚠️ Failed to initialize Redis, using in-memory fallback:", err);
  }
}

// =======================
// CIRCUIT BREAKERS
// =======================

/**
 * Circuit breakers para cada provider de IA
 * Evitam cascade failures quando um provider está instável
 */
const geminiCircuit = new CircuitBreaker(
  "gemini",
  {
    failureThreshold: 5, // 5 falhas consecutivas → OPEN
    timeoutMs: 30_000, // 30s em OPEN antes de tentar HALF_OPEN
    halfOpenMaxCalls: 3, // 3 tentativas em HALF_OPEN
  },
  logger
);

const claudeCircuit = new CircuitBreaker(
  "claude",
  {
    failureThreshold: 5,
    timeoutMs: 30_000,
    halfOpenMaxCalls: 3,
  },
  logger
);

const openaiCircuit = new CircuitBreaker(
  "openai",
  {
    failureThreshold: 5,
    timeoutMs: 30_000,
    halfOpenMaxCalls: 3,
  },
  logger
);

// =======================
// RATE LIMITING (Redis + Fallback)
// =======================

const RATE_LIMIT = {
  maxRequests: 20, // 20 requests por minuto
  windowMs: 60_000, // 1 minuto (60 segundos)
  windowSec: 60, // Para TTL do Redis
  maxTokensPerMin: 50_000, // Cap de tokens por minuto
};

// In-memory fallback (para quando Redis não está disponível)
const rateLimitsMemory = new Map<string, { count: number; resetAt: number; tokens: number }>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // segundos até reset
  source: "redis" | "memory";
}

/**
 * Check rate limit using Upstash Redis (production-ready)
 * Falls back to in-memory if Redis is unavailable
 */
async function checkRateLimitRedis(
  userId: string,
  estimatedTokens: number
): Promise<RateLimitResult> {
  const requestKey = `ratelimit:requests:${userId}`;
  const tokenKey = `ratelimit:tokens:${userId}`;

  // Try Redis first
  if (redis) {
    try {
      // Use Redis pipeline for atomic operations
      const pipeline = redis.pipeline();

      // Get current values
      pipeline.get(requestKey);
      pipeline.get(tokenKey);
      pipeline.ttl(requestKey);

      const results = await pipeline.exec();
      const currentRequests = (results[0] as number) || 0;
      const currentTokens = (results[1] as number) || 0;
      const ttl = (results[2] as number) || -1;

      // Check if over limit
      if (currentRequests >= RATE_LIMIT.maxRequests) {
        console.log(
          `🚫 Rate limit HIT (requests): user=${userId}, requests=${currentRequests}/${RATE_LIMIT.maxRequests}`
        );
        return {
          allowed: false,
          remaining: 0,
          resetIn: ttl > 0 ? ttl : RATE_LIMIT.windowSec,
          source: "redis",
        };
      }

      if (currentTokens + estimatedTokens > RATE_LIMIT.maxTokensPerMin) {
        console.log(
          `🚫 Rate limit HIT (tokens): user=${userId}, tokens=${currentTokens}+${estimatedTokens}/${RATE_LIMIT.maxTokensPerMin}`
        );
        return {
          allowed: false,
          remaining: 0,
          resetIn: ttl > 0 ? ttl : RATE_LIMIT.windowSec,
          source: "redis",
        };
      }

      // Increment counters atomically
      const incrPipeline = redis.pipeline();

      if (currentRequests === 0) {
        // First request in window - set with expiry
        incrPipeline.setex(requestKey, RATE_LIMIT.windowSec, 1);
        incrPipeline.setex(tokenKey, RATE_LIMIT.windowSec, estimatedTokens);
      } else {
        // Increment existing counters
        incrPipeline.incr(requestKey);
        incrPipeline.incrby(tokenKey, estimatedTokens);
      }

      await incrPipeline.exec();

      const remaining = RATE_LIMIT.maxRequests - currentRequests - 1;
      console.log(
        `✅ Rate limit OK: user=${userId}, requests=${currentRequests + 1}/${RATE_LIMIT.maxRequests}, remaining=${remaining}`
      );

      return {
        allowed: true,
        remaining,
        resetIn: ttl > 0 ? ttl : RATE_LIMIT.windowSec,
        source: "redis",
      };
    } catch (redisError) {
      console.error("⚠️ Redis error, falling back to in-memory:", redisError);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  return checkRateLimitMemory(userId, estimatedTokens);
}

/**
 * In-memory rate limiting fallback
 */
function checkRateLimitMemory(userId: string, estimatedTokens: number): RateLimitResult {
  const now = Date.now();
  const limit = rateLimitsMemory.get(userId);

  // Resetar janela se expirou
  if (!limit || limit.resetAt < now) {
    rateLimitsMemory.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
      tokens: estimatedTokens,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequests - 1,
      resetIn: RATE_LIMIT.windowSec,
      source: "memory",
    };
  }

  // Verificar request count
  if (limit.count >= RATE_LIMIT.maxRequests) {
    console.log(
      `🚫 Rate limit HIT (memory): user=${userId}, requests=${limit.count}/${RATE_LIMIT.maxRequests}`
    );
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((limit.resetAt - now) / 1000),
      source: "memory",
    };
  }

  // Verificar token cap
  if (limit.tokens + estimatedTokens > RATE_LIMIT.maxTokensPerMin) {
    console.log(
      `🚫 Rate limit HIT (memory/tokens): user=${userId}, tokens=${limit.tokens}+${estimatedTokens}/${RATE_LIMIT.maxTokensPerMin}`
    );
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((limit.resetAt - now) / 1000),
      source: "memory",
    };
  }

  // Incrementar
  limit.count++;
  limit.tokens += estimatedTokens;

  return {
    allowed: true,
    remaining: RATE_LIMIT.maxRequests - limit.count,
    resetIn: Math.ceil((limit.resetAt - now) / 1000),
    source: "memory",
  };
}

/**
 * Legacy sync function for backward compatibility
 * @deprecated Use checkRateLimitRedis instead
 */
function checkRateLimit(userId: string, estimatedTokens: number): boolean {
  return checkRateLimitMemory(userId, estimatedTokens).allowed;
}

// =======================
// PAYLOAD VALIDATION
// =======================

const PAYLOAD_CAPS = {
  maxMessages: 100, // Máximo de mensagens no histórico
  maxCharsPerMessage: 4000, // ~1000 tokens por mensagem
  maxTotalChars: 200_000, // ~50K tokens total
};

function validatePayload(messages: AIMessage[]): { valid: boolean; error?: string } {
  if (messages.length > PAYLOAD_CAPS.maxMessages) {
    return {
      valid: false,
      error: `Too many messages (max ${PAYLOAD_CAPS.maxMessages})`,
    };
  }

  let totalChars = 0;

  for (const msg of messages) {
    if (typeof msg.content !== "string") {
      return { valid: false, error: "Message content must be string" };
    }

    const charCount = msg.content.length;

    if (charCount > PAYLOAD_CAPS.maxCharsPerMessage) {
      return {
        valid: false,
        error: `Message too long (max ${PAYLOAD_CAPS.maxCharsPerMessage} chars)`,
      };
    }

    totalChars += charCount;
  }

  if (totalChars > PAYLOAD_CAPS.maxTotalChars) {
    return {
      valid: false,
      error: `Total payload too large (max ${PAYLOAD_CAPS.maxTotalChars} chars)`,
    };
  }

  return { valid: true };
}

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req) => {
  const requestId = generateRequestId();
  const requestStartTime = Date.now();
  const origin = req.headers.get("origin") || "";

  // CORS preflight
  if (req.method === "OPTIONS") {
    const allowOrigin = ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
      ? origin
      : ALLOWED_ORIGINS[0];

    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const allowOrigin = ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
    ? origin
    : ALLOWED_ORIGINS[0];

  // Track metrics for this request
  let userId = "";
  let providerUsed = "";
  let messageCount = 0;
  let estimatedTokens = 0;
  let actualUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let wasFallback = false;
  let rateLimitSource: "redis" | "memory" = "memory";
  let hasImage = false;
  let hasGrounding = false;

  try {
    // 1. JWT Validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logger.auth("failure", undefined, "Missing authorization header");
      return jsonResponse({ error: "Missing authorization header" }, 401, allowOrigin);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      logger.auth("failure", undefined, authError?.message || "Invalid token");
      return jsonResponse({ error: "Invalid or expired token" }, 401, allowOrigin);
    }

    userId = user.id;
    logger.auth("success", userId);

    // 2. Parse request
    const body = await req.json();
    const { messages, provider, systemPrompt, grounding, imageData } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      logger.warn("invalid_request", { requestId, reason: "Invalid messages array" });
      return jsonResponse({ error: "Invalid messages array" }, 400, allowOrigin);
    }

    messageCount = messages.length;
    hasImage = !!imageData;
    hasGrounding = !!grounding;

    // 3. Validate payload caps
    const validation = validatePayload(messages);
    if (!validation.valid) {
      logger.warn("payload_validation_failed", {
        requestId,
        userId: hashUserId(userId),
        reason: validation.error,
        messageCount,
      });
      return jsonResponse({ error: validation.error }, 400, allowOrigin);
    }

    // 4. Rate limiting (Redis with in-memory fallback)
    estimatedTokens = Math.ceil(
      messages.reduce((sum: number, m: { content: string }) => sum + m.content.length, 0) / 4
    );

    const rateLimitResult = await checkRateLimitRedis(user.id, estimatedTokens);
    rateLimitSource = rateLimitResult.source;

    if (!rateLimitResult.allowed) {
      logger.rateLimit(
        userId,
        "requests",
        RATE_LIMIT.maxRequests,
        RATE_LIMIT.maxRequests,
        rateLimitSource
      );
      return jsonResponse(
        {
          error: "Rate limit exceeded. Try again in a minute.",
          retryAfter: rateLimitResult.resetIn,
          remaining: rateLimitResult.remaining,
          source: rateLimitResult.source,
        },
        429,
        allowOrigin
      );
    }

    // Detectar última mensagem do usuário para análise de crise
    const lastUserMessage = messages.filter((m: AIMessage) => m.role === "user").pop();
    const messageText = lastUserMessage?.content || "";
    const isCrisisMessage = isCrisis(messageText);

    if (isCrisisMessage) {
      logger.warn("crisis_detected", {
        requestId,
        userId: hashUserId(userId),
        keywords: CRISIS_KEYWORDS.filter((k) => messageText.toLowerCase().includes(k)),
      });
    }

    // 4.1 Fetch NathIA Context (Wellness/Sleep/Mood)
    let contextSuffix = "";
    if (!isCrisisMessage) {
      try {
        const { data: contextData, error: contextError } = await supabase.rpc(
          "generate_nathia_context_prompt",
          { p_user_id: userId }
        );

        if (!contextError && contextData) {
          contextSuffix = `\n\nCONTEXTO EM TEMPO REAL:\n${contextData}`;
          logger.info("context_injected", { userId: hashUserId(userId) });
        }
      } catch (err) {
        logger.debug("context_fetch_failed", { error: err });
      }
    }

    // Construct final system prompt
    const baseSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;
    const finalSystemPrompt = isCrisisMessage 
      ? (systemPrompt || CRISIS_SYSTEM_PROMPT) 
      : (baseSystemPrompt + contextSuffix);

    // Log request start
    logger.info("request_started", {
      requestId,
      userId: hashUserId(userId),
      provider: provider || "claude",
      messageCount,
      estimatedTokens,
      features: { hasImage, hasGrounding },
      contextInjected: !!contextSuffix,
    });

    // 5. Call AI provider with CRISIS DETECTION + GUARDRAIL
    // ORDEM: Crise → Claude | Normal → Gemini | Fallback → Claude → OpenAI
    let response: ApiResponse & { fallback?: boolean };
    const aiStartTime = Date.now();
    const requestedProvider = provider || "gemini";

    try {
      if (isCrisisMessage) {
        // 🚨 CRISE: Usa Claude SEMPRE (modelo mais seguro para situações delicadas)
        logger.info("crisis_routing", { requestId, to: "claude" });
        response = await callClaude(messages, finalSystemPrompt);
        providerUsed = "claude-crisis";
      } else if (grounding) {
        // Grounding sempre usa Gemini + Google Search
        response = await callGeminiWithGrounding(messages, finalSystemPrompt);
        providerUsed = "gemini-grounding";
      } else if (imageData) {
        // Imagens usam Claude Vision (único caso onde Claude é default)
        response = await callClaudeVision(messages, finalSystemPrompt, imageData);
        providerUsed = "claude-vision";
      } else if (provider === "claude") {
        // Claude só se explicitamente solicitado
        response = await callClaude(messages, finalSystemPrompt);
        providerUsed = "claude";
      } else {
        // DEFAULT: Gemini 2.5 Flash - rápido, direto, persona estável
        response = await callGemini(messages, finalSystemPrompt);
        providerUsed = "gemini";

        // 🛡️ GUARDRAIL PÓS-RESPOSTA: Se Gemini disse algo proibido, reprocessa com Claude
        if (hasBlockedPhrase(response.content)) {
          logger.warn("guardrail_triggered", {
            requestId,
            blockedPhrases: BLOCKED_PHRASES.filter((p) =>
              response.content.toLowerCase().includes(p)
            ),
          });
          logger.info("guardrail_reprocessing", { requestId, from: "gemini", to: "claude" });
          response = await callClaude(messages, finalSystemPrompt);
          providerUsed = "claude-guardrail";
          wasFallback = true;
        }
      }
    } catch (primaryError) {
      const errorMessage = primaryError instanceof Error ? primaryError.message : "Unknown error";
      logger.fallback(requestId, requestedProvider, "claude", errorMessage);
      logger.error("provider_error", primaryError as Error, {
        requestId,
        provider: requestedProvider,
      });

      // FALLBACK CHAIN: Gemini falhou → tenta Claude → depois OpenAI
      try {
        logger.info("fallback_attempt", { requestId, from: requestedProvider, to: "claude" });
        response = await callClaude(messages, finalSystemPrompt);
        response.fallback = true;
        wasFallback = true;
        providerUsed = "claude-fallback";
      } catch (claudeError) {
        const claudeErrorMsg = claudeError instanceof Error ? claudeError.message : "Unknown error";
        logger.fallback(requestId, "claude", "openai", claudeErrorMsg);
        logger.info("fallback_attempt", { requestId, from: "claude", to: "openai" });

        // Último recurso: OpenAI
        response = await callOpenAI(messages, finalSystemPrompt);
        response.fallback = true;
        wasFallback = true;
        providerUsed = "openai-fallback";
      }
    }

    const latency = Date.now() - aiStartTime;
    actualUsage = response.usage;

    // 6. Log analytics to database (non-blocking)
    supabase
      .from("ai_requests")
      .insert({
        user_id: user.id,
        provider: response.provider,
        tokens: response.usage.totalTokens,
        latency_ms: latency,
        fallback: response.fallback || false,
        created_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          logger.warn("analytics_insert_failed", { requestId, error: error.message });
        }
      });

    // 7. Log request metrics
    logger.metrics({
      requestId,
      userId,
      provider: providerUsed,
      messageCount,
      estimatedInputTokens: estimatedTokens,
      actualInputTokens: actualUsage.promptTokens,
      outputTokens: actualUsage.completionTokens,
      totalTokens: actualUsage.totalTokens,
      latencyMs: latency,
      success: true,
      fallback: wasFallback,
      rateLimitSource,
      hasImage,
      hasGrounding,
    });

    return jsonResponse({ ...response, latency, requestId }, 200, allowOrigin);
  } catch (error) {
    const totalLatency = Date.now() - requestStartTime;
    const err = error instanceof Error ? error : new Error(String(error));

    logger.error("request_failed", err, {
      requestId,
      userId: userId ? hashUserId(userId) : undefined,
      latencyMs: totalLatency,
    });

    // Log failed metrics
    if (userId) {
      logger.metrics({
        requestId,
        userId,
        provider: providerUsed || "unknown",
        messageCount,
        estimatedInputTokens: estimatedTokens,
        latencyMs: totalLatency,
        success: false,
        fallback: wasFallback,
        rateLimitSource,
        hasImage,
        hasGrounding,
      });
    }

    return jsonResponse(
      {
        error: "Internal server error",
        details: err.message,
        requestId,
      },
      500,
      allowOrigin
    );
  }
});

// =======================
// PROVIDER FUNCTIONS
// =======================

/**
 * Claude Sonnet 4.5 (FALLBACK) - Texto apenas
 * Usado quando Gemini falha ou para casos especiais (vision)
 */
async function callClaude(messages: AIMessage[], systemPrompt?: string): Promise<ApiResponse> {
  return claudeCircuit.execute(async () => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt || DEFAULT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((block) => block.type === "text");

    return {
      content: textContent?.type === "text" ? textContent.text : "",
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      provider: "claude",
    };
  });
}

/**
 * Claude Vision - Suporta imagens (ultrassons, fotos)
 */
async function callClaudeVision(
  messages: AIMessage[],
  systemPrompt: string | undefined,
  imageData: ImageData
): Promise<ApiResponse> {
  return claudeCircuit.execute(async () => {
    // Converter mensagens para formato Claude (content como array de blocks)
    const claudeMessages = messages.map((m, idx) => {
      // Última mensagem do usuário pode ter imagem
      if (idx === messages.length - 1 && m.role === "user") {
        return {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageData.mediaType,
                data: imageData.base64,
              },
            },
            {
              type: "text",
              text: m.content,
            },
          ],
        };
      }

      return {
        role: m.role,
        content: m.content, // Texto simples
      };
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt || DEFAULT_SYSTEM_PROMPT,
      messages: claudeMessages,
    });

    const textContent = response.content.find((block) => block.type === "text");

    return {
      content: textContent?.type === "text" ? textContent.text : "",
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      provider: "claude-vision",
    };
  });
}

/**
 * Gemini 2.5 Flash (DEFAULT) - NathIA principal
 * Rápido, direto, persona estável
 */
async function callGemini(messages: AIMessage[], systemPrompt?: string): Promise<ApiResponse> {
  return geminiCircuit.execute(async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_KEY}`;

    // Converter para formato Gemini
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      ...(systemPrompt && {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      }),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";

    return {
      content: text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      provider: "gemini",
    };
  });
}

/**
 * Gemini 2.5 Flash + Grounding (Google Search)
 * Para perguntas médicas que precisam de fontes atualizadas
 */
interface GroundingChunk {
  web?: {
    title?: string;
    uri?: string;
  };
}

async function callGeminiWithGrounding(
  messages: AIMessage[],
  systemPrompt?: string
): Promise<ApiResponse> {
  return geminiCircuit.execute(async () => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_KEY}`;

    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      ...(systemPrompt && {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      }),
      // Google Search tool (correção: google_search, não googleSearch)
      tools: [
        {
          google_search: {},
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini grounding error: ${error}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";

    // Extrair citations corretamente (groundingChunks)
    const groundingChunks: GroundingChunk[] = candidate?.groundingMetadata?.groundingChunks || [];
    const searchEntryPoint = candidate?.groundingMetadata?.searchEntryPoint?.renderedContent;

    const citations = groundingChunks.map((chunk) => ({
      title: chunk.web?.title,
      url: chunk.web?.uri,
    }));

    return {
      content: text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      provider: "gemini-grounding",
      grounding: {
        searchEntryPoint,
        citations,
      },
    };
  });
}

/**
 * OpenAI GPT-4o (ÚLTIMO RECURSO)
 * Só usado quando Gemini E Claude falharam
 */
async function callOpenAI(messages: AIMessage[], systemPrompt?: string): Promise<ApiResponse> {
  return openaiCircuit.execute(async () => {
    const openaiMessages = [
      ...(systemPrompt
        ? [{ role: "system" as const, content: systemPrompt }]
        : [{ role: "system" as const, content: DEFAULT_SYSTEM_PROMPT }]),
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      max_tokens: 2048,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "";

    return {
      content,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      provider: "openai-fallback",
    };
  });
}

// =======================
// HELPERS
// =======================

function jsonResponse(data: Record<string, unknown>, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
}

/**
 * CRISIS_SYSTEM_PROMPT - Usado APENAS em situações de crise
 * Resposta estruturada, sem variação
 */
const CRISIS_SYSTEM_PROMPT = `Você é NathIA, assistente do app Nossa Maternidade.
Inspirada no estilo da Nathália Valente. Você NÃO é ela.

## REGRAS ABSOLUTAS

1. NUNCA diagnostique ("você tem depressão/ansiedade/mastite")
2. NUNCA prescreva ("você precisa/deve/tem que")
3. NUNCA crie dependência ("eu fico aqui", "pode contar comigo sempre")
4. NUNCA use culpa ("seu bebê precisa de você")
5. NUNCA julgue escolhas (parto, amamentação, criação)

Se quebraria uma regra → não responda aquilo. Redirecione.

## CRISE (Prioridade máxima)

Se detectar risco (suicídio, automutilação, desespero extremo), responda APENAS:

---
Sinto muito que você esteja passando por isso. 💙

Eu não consigo te manter segura sozinha.

Risco imediato: SAMU 192
Sofrimento emocional: CVV 188 (24h)

Se puder, chame alguém de confiança agora.
---

Nada mais. Não adicione. Não personalize.`;

/**
 * DEFAULT_SYSTEM_PROMPT - NathIA v2.0
 * Versão otimizada: direta, segura, eficiente
 */
const DEFAULT_SYSTEM_PROMPT = `Você é a NathIA, a inteligência de apoio integral da plataforma NossaMaternidade.
Inspirada no estilo Calm FemTech: Acolhedora, Madura, Sofisticada e Proativa.

## DIRETRIZES DE IDENTIDADE (CALM FEMTECH)
1. FOCO NA MULHER: A usuária é um indivíduo completo. A maternidade é o contexto, mas a saúde mental, o sono e a identidade DELA são as prioridades.
2. TOM DE VOZ: Use uma linguagem serena e madura. Evite clichês infantis ou diminutivos excessivos. Seja concisa e respeite o tempo da usuária.
3. VALIDAÇÃO ANTES DA SOLUÇÃO: Sempre valide o estado emocional da usuária antes de oferecer conselhos práticos.

## INTEGRAÇÃO DE WELLNESS
- Se receber dados de contexto (sono, humor), ajuste seu tom.
- Sugira micro-pausas e rituais de autocuidado.

## REGRAS ABSOLUTAS DE SEGURANÇA
1. NUNCA diagnostique ("você tem depressão/ansiedade/mastite")
2. NUNCA prescreva ("você precisa/deve/tem que")
3. NUNCA crie dependência ("eu fico aqui", "pode contar comigo sempre")
4. NUNCA use culpa ("seu bebê precisa de você")
5. NUNCA julgue escolhas (parto, amamentação, criação)

Se quebraria uma regra → não responda aquilo. Redirecione.

## CRISE
Se detectar risco (suicídio, automutilação, desespero extremo), responda APENAS:

---
Sinto muito que você esteja passando por isso. 💙

Eu não consigo te manter segura sozinha.

Risco imediato: SAMU 192
Sofrimento emocional: CVV 188 (24h)

Se puder, chame alguém de confiança agora.
---`;
