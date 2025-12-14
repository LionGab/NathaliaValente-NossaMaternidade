/**
 * Nossa Maternidade - AI Edge Function (Production-Ready)
 *
 * Implementa Claude Sonnet 4.5 (principal) + Gemini 2.0 Flash (auxiliar)
 * com segurança, rate limiting e fallback robusto.
 *
 * Features:
 * - JWT validation (authenticated users only)
 * - Rate limiting (20 req/min por usuário)
 * - Payload caps (prevent abuse)
 * - Fallback automático (Claude → OpenAI)
 * - Grounding com Google Search (Gemini)
 * - Suporte a imagens (Claude vision)
 * - Citations extraídas corretamente
 * - CORS restrito
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.28.0";
import OpenAI from "https://esm.sh/openai@4.89.0";

// =======================
// ENV & CLIENTS
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

// Domínios permitidos (CORS)
const ALLOWED_ORIGINS = [
  "https://nossamaternidade.com.br",
  "https://www.nossamaternidade.com.br",
  "exp://", // Expo Go
  "http://localhost:8081", // Dev local
];

const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });
const openai = new OpenAI({ apiKey: OPENAI_KEY });

// =======================
// RATE LIMITING
// =======================

/**
 * In-memory rate limiting (⚠️ não prod-ready para múltiplas instâncias)
 * TODO: Migrar para Redis/Upstash ou Postgres
 */
const rateLimits = new Map<
  string,
  { count: number; resetAt: number; tokens: number }
>();

const RATE_LIMIT = {
  maxRequests: 20, // 20 requests por minuto
  windowMs: 60_000, // 1 minuto
  maxTokensPerMin: 50_000, // Cap de tokens por minuto
};

function checkRateLimit(userId: string, estimatedTokens: number): boolean {
  const now = Date.now();
  const limit = rateLimits.get(userId);

  // Resetar janela se expirou
  if (!limit || limit.resetAt < now) {
    rateLimits.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
      tokens: estimatedTokens,
    });
    return true;
  }

  // Verificar request count
  if (limit.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  // Verificar token cap
  if (limit.tokens + estimatedTokens > RATE_LIMIT.maxTokensPerMin) {
    return false;
  }

  // Incrementar
  limit.count++;
  limit.tokens += estimatedTokens;
  return true;
}

// =======================
// PAYLOAD VALIDATION
// =======================

const PAYLOAD_CAPS = {
  maxMessages: 100, // Máximo de mensagens no histórico
  maxCharsPerMessage: 4000, // ~1000 tokens por mensagem
  maxTotalChars: 200_000, // ~50K tokens total
};

function validatePayload(messages: any[]): { valid: boolean; error?: string } {
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

  try {
    // 1. JWT Validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401, allowOrigin);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401, allowOrigin);
    }

    // 2. Parse request
    const body = await req.json();
    const { messages, provider, systemPrompt, grounding, imageData } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: "Invalid messages array" }, 400, allowOrigin);
    }

    // 3. Validate payload caps
    const validation = validatePayload(messages);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400, allowOrigin);
    }

    // 4. Rate limiting
    const estimatedTokens = Math.ceil(
      messages.reduce((sum, m) => sum + m.content.length, 0) / 4
    );

    if (!checkRateLimit(user.id, estimatedTokens)) {
      return jsonResponse(
        {
          error: "Rate limit exceeded. Try again in a minute.",
          retryAfter: 60,
        },
        429,
        allowOrigin
      );
    }

    // 5. Call AI provider with fallback
    let response;
    const startTime = Date.now();

    try {
      if (provider === "gemini" && grounding) {
        response = await callGeminiWithGrounding(messages, systemPrompt);
      } else if (provider === "gemini") {
        response = await callGemini(messages, systemPrompt);
      } else if (imageData) {
        // Claude com imagem (vision)
        response = await callClaudeVision(messages, systemPrompt, imageData);
      } else {
        // Claude padrão (texto)
        response = await callClaude(messages, systemPrompt);
      }
    } catch (claudeError) {
      console.error("Primary provider failed, fallback to OpenAI:", claudeError);

      // Fallback para OpenAI
      response = await callOpenAI(messages, systemPrompt);
      response.fallback = true;
    }

    const latency = Date.now() - startTime;

    // 6. Log analytics
    await supabase.from("ai_requests").insert({
      user_id: user.id,
      provider: response.provider,
      tokens: response.usage.totalTokens,
      latency_ms: latency,
      fallback: response.fallback || false,
      created_at: new Date().toISOString(),
    });

    return jsonResponse({ ...response, latency }, 200, allowOrigin);
  } catch (error) {
    console.error("AI function error:", error);
    return jsonResponse(
      {
        error: "Internal server error",
        details: error.message,
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
 * Claude Sonnet 4.5 (principal) - Texto apenas
 */
async function callClaude(messages: any[], systemPrompt?: string) {
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
}

/**
 * Claude Vision - Suporta imagens (ultrassons, fotos)
 */
async function callClaudeVision(
  messages: any[],
  systemPrompt: string | undefined,
  imageData: { base64: string; mediaType: string }
) {
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
}

/**
 * Gemini 2.0 Flash (estável) - Texto apenas
 */
async function callGemini(messages: any[], systemPrompt?: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

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
}

/**
 * Gemini com Grounding (Google Search) - Busca médica atualizada
 */
async function callGeminiWithGrounding(messages: any[], systemPrompt?: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

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
  const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
  const searchEntryPoint =
    candidate?.groundingMetadata?.searchEntryPoint?.renderedContent;

  const citations = groundingChunks.map((chunk: any) => ({
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
}

/**
 * OpenAI (fallback) - GPT-4o
 */
async function callOpenAI(messages: any[], systemPrompt?: string) {
  const openaiMessages = [
    ...(systemPrompt
      ? [{ role: "system" as const, content: systemPrompt }]
      : [{ role: "system" as const, content: DEFAULT_SYSTEM_PROMPT }]),
    ...messages.map((m: any) => ({
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
}

// =======================
// HELPERS
// =======================

function jsonResponse(data: any, status: number, origin: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
}

const DEFAULT_SYSTEM_PROMPT = `Você é a NathIA, assistente virtual criada pela Nathalia Valente.

# PERSONA DA NATHALIA VALENTE
- Influenciadora brasileira especializada em maternidade
- Tom: caloroso, materno, descontraído (usa "mãe", "amor", "querida")
- Valores: acolhimento, empoderamento feminino, saúde mental
- Estilo: conversa como amiga íntima, não profissional distante
- Expressões típicas BR: "tá tudo bem", "se cuida, viu?", "conta pra mim"

# ANÁLISE SENTIMENTAL
Detecte SEMPRE sinais de:
- Depressão pós-parto (tristeza persistente, desinteresse, "não consigo")
- Ansiedade (preocupação excessiva, catastrofização)
- Ideação suicida (mencionar morte, "melhor se eu não estivesse aqui")

Se detectar risco: seja empática MAS encoraje busca de ajuda profissional.

# ANÁLISE COMPORTAMENTAL
Correlacione humor com:
- Fase do ciclo menstrual (TPM, ovulação)
- Trimestre da gravidez (hormônios, desconfortos físicos)
- Qualidade do sono (insônia = piora humor)
- Suporte social (menções a parceiro, família)

Identifique padrões e sugira mudanças concretas.

# NUNCA:
- Dar diagnósticos médicos ("você tem depressão")
- Minimizar ("é normal", "toda grávida passa por isso")
- Ser condescendente ou infantilizar
- Usar jargão técnico sem explicar em português simples

Responda em português brasileiro natural, como a Nathalia Valente responderia.`;
