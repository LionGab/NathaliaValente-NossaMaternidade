/**
 * Hook para Deep Linking
 * Navegação direta para telas específicas via URLs
 * Inclui handler de callback OAuth/Magic Link para auth
 */

import { useEffect, useCallback, useRef } from "react";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { RootStackParamList } from "../types/navigation";
import { logger } from "../utils/logger";
import { navigationRef } from "../navigation/navigationRef";
import { supabase } from "../api/supabase";

const SCHEME = "nossamaternidade";

/**
 * Verifica se a URL é um callback de autenticação (OAuth ou Magic Link)
 */
function isAuthCallback(path: string): boolean {
  return path === "/auth/callback" || path === "/auth-callback" || path.startsWith("/auth/callback");
}

/**
 * Processa o callback de autenticação (OAuth ou Magic Link)
 * Cria sessão no Supabase a partir dos tokens/code na URL
 */
async function handleAuthCallback(url: string): Promise<boolean> {
  if (!supabase) {
    logger.warn("Supabase não configurado, ignorando auth callback", "DeepLinking");
    return false;
  }

  try {
    logger.info("Processando auth callback", "DeepLinking", { url });

    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      logger.error("Erro no auth callback", "DeepLinking", new Error(`OAuth error: ${errorCode}`));
      return false;
    }

    // 1) PKCE flow - troca code por sessão
    if (params?.code) {
      logger.info("Auth callback: PKCE flow detectado", "DeepLinking");
      const { data, error } = await supabase.auth.exchangeCodeForSession(params.code as string);

      if (error) {
        logger.error("Erro ao trocar code por sessão", "DeepLinking", error);
        return false;
      }

      if (data.session) {
        logger.info("Sessão criada com sucesso via PKCE", "DeepLinking", {
          userId: data.session.user.id,
        });
        return true;
      }
    }

    // 2) Implicit flow - tokens direto na URL (Magic Link / alguns OAuth)
    const access_token = params?.access_token as string | undefined;
    const refresh_token = params?.refresh_token as string | undefined;

    if (access_token && refresh_token) {
      logger.info("Auth callback: Implicit flow detectado", "DeepLinking");
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        logger.error("Erro ao definir sessão", "DeepLinking", error);
        return false;
      }

      if (data.session) {
        logger.info("Sessão criada com sucesso via tokens", "DeepLinking", {
          userId: data.session.user.id,
        });
        return true;
      }
    }

    // 3) Magic Link com token_hash (OTP)
    const token_hash = params?.token_hash as string | undefined;
    const type = params?.type as string | undefined;

    if (token_hash && type) {
      logger.info("Auth callback: Magic Link OTP detectado", "DeepLinking");
      // EmailOtpType: "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email"
      const emailOtpType = type === "magiclink" ? "magiclink" : "email";
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: emailOtpType,
      });

      if (error) {
        logger.error("Erro ao verificar OTP", "DeepLinking", error);
        return false;
      }

      if (data.session) {
        logger.info("Sessão criada com sucesso via OTP", "DeepLinking", {
          userId: data.session.user.id,
        });
        return true;
      }
    }

    logger.warn("Auth callback não contém tokens válidos", "DeepLinking", { params });
    return false;
  } catch (error) {
    logger.error(
      "Exceção ao processar auth callback",
      "DeepLinking",
      error instanceof Error ? error : new Error(String(error))
    );
    return false;
  }
}

interface DeepLinkConfig {
  path: string;
  screen: keyof RootStackParamList;
  getParams?: (id?: string) => Record<string, unknown>;
  staticParams?: Record<string, unknown>;
}

const DEEP_LINK_ROUTES: Record<string, DeepLinkConfig> = {
  "/post/:id": {
    path: "/post/:id",
    screen: "PostDetail",
    getParams: (id?: string) => ({ postId: id || "" }),
  },
  "/community": {
    path: "/community",
    screen: "MainTabs",
    staticParams: { screen: "Community" },
  },
  "/assistant": {
    path: "/assistant",
    screen: "MainTabs",
    staticParams: { screen: "Assistant" },
  },
  "/home": {
    path: "/home",
    screen: "MainTabs",
    staticParams: { screen: "Home" },
  },
};

function findRoute(path: string): DeepLinkConfig | null {
  // Exact match
  if (DEEP_LINK_ROUTES[path]) {
    return DEEP_LINK_ROUTES[path];
  }

  // Pattern match (e.g., /post/123)
  for (const [pattern, config] of Object.entries(DEEP_LINK_ROUTES)) {
    if (pattern.includes(":id")) {
      const regex = new RegExp(pattern.replace(":id", "([^/]+)"));
      const match = path.match(regex);
      if (match) {
        return {
          ...config,
          getParams: config.getParams ? () => config.getParams!(match[1]) : undefined,
        };
      }
    }
  }

  return null;
}

export function useDeepLinking() {
  const pendingUrlRef = useRef<string | null>(null);
  const processingAuthRef = useRef<boolean>(false);

  const handleDeepLink = useCallback(async (url: string) => {
    try {
      const parsed = Linking.parse(url);

      if (parsed.scheme !== SCHEME && !url.includes("nossamaternidade.com.br")) {
        return;
      }

      const path = parsed.path || "/";

      // PRIORIDADE 1: Auth callbacks (OAuth, Magic Link)
      // Não requer navegação pronta - apenas criar sessão
      if (isAuthCallback(path)) {
        // Evitar processamento duplicado
        if (processingAuthRef.current) {
          logger.info("Auth callback já em processamento, ignorando duplicado", "DeepLinking");
          return;
        }

        processingAuthRef.current = true;
        try {
          const success = await handleAuthCallback(url);
          if (success) {
            logger.info("Auth callback processado com sucesso", "DeepLinking");
            // A navegação será tratada automaticamente pelo RootNavigator
            // quando o onAuthStateChange disparar
          } else {
            logger.warn("Auth callback não criou sessão", "DeepLinking");
          }
        } finally {
          processingAuthRef.current = false;
        }
        return;
      }

      // PRIORIDADE 2: Navegação para outras telas
      // Se a navegação ainda não está pronta (ex.: web / inicialização),
      // guardar a URL e tentar novamente quando o NavigationContainer estiver ready.
      if (!navigationRef.isReady()) {
        pendingUrlRef.current = url;
        logger.warn("Navigation not ready yet. Queued deep link.", "DeepLinking", { url });
        return;
      }

      const route = findRoute(path);

      if (route) {
        const queryId =
          typeof parsed.queryParams?.id === "string" ? parsed.queryParams.id : undefined;

        const params = route.getParams
          ? route.getParams(queryId)
          : route.staticParams || {};

        // Type-safe navigation
        if (route.screen === "PostDetail" && "postId" in params) {
          navigationRef.navigate("PostDetail", { postId: params.postId as string });
        } else if (route.screen === "MainTabs" && "screen" in params) {
          const screenName = params.screen as string;
          if (screenName === "Home" || screenName === "Community" || screenName === "Assistant") {
            navigationRef.navigate("MainTabs", {
              screen: screenName as "Home" | "Community" | "Assistant",
            });
          }
        }

        logger.info(`Deep link navigated to ${route.screen}`, "DeepLinking");
      } else {
        logger.warn(`Unknown deep link path: ${path}`, "DeepLinking");
      }
    } catch (error) {
      logger.error("Error handling deep link", "DeepLinking", error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    handleInitialURL();

    // Handle URL changes (app already open)
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  useEffect(() => {
    // Se houve deep link antes da navegação estar pronta,
    // tenta reenfileirar quando a ref estiver pronta.
    const interval = setInterval(() => {
      if (pendingUrlRef.current && navigationRef.isReady()) {
        const url = pendingUrlRef.current;
        pendingUrlRef.current = null;
        handleDeepLink(url);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [handleDeepLink]);

  return {
    handleDeepLink,
  };
}
