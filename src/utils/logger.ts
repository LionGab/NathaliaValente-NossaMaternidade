/**
 * Logger centralizado para o app
 * Substitui console.log/error por sistema de logging controlado
 * Integrado com Sentry para monitoramento em produção
 */

import * as Sentry from "@sentry/react-native";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = __DEV__;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;
  private sentryInitialized = false;

  private formatMessage(message: string, context?: string): string {
    const prefix = context ? `[${context}]` : '';
    return `${prefix} ${message}`;
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private log(level: LogLevel, message: string, context?: string, error?: Error, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      metadata,
    };

    this.addToHistory(entry);

    // Em desenvolvimento, sempre logar no console
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(message, context);
      
      switch (level) {
        case 'info':
          // eslint-disable-next-line no-console -- Logger central, console.log intencional
          console.log(formattedMessage, metadata || '');
          break;
        case 'warn':
          console.warn(formattedMessage, metadata || '');
          break;
        case 'error':
          console.error(formattedMessage, error || '', metadata || '');
          break;
        case 'debug':
          // eslint-disable-next-line no-console -- Logger central, console.debug intencional
          console.debug(formattedMessage, metadata || '');
          break;
      }
    }

    // Em produção, enviar erros para Sentry
    if (!this.isDevelopment && level === 'error' && this.sentryInitialized) {
      Sentry.captureException(error || new Error(message), {
        level: 'error',
        contexts: {
          logger: {
            context,
            metadata,
          },
        },
      });
    }

    // Adicionar breadcrumb para todos os logs (ajuda no contexto de erros)
    if (this.sentryInitialized && level !== 'debug') {
      Sentry.addBreadcrumb({
        level: level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'info',
        message: this.formatMessage(message, context),
        data: metadata,
        timestamp: Date.now() / 1000,
      });
    }
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, context, undefined, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, context, undefined, metadata);
  }

  error(message: string, context?: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('error', message, context, error, metadata);
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log('debug', message, context, undefined, metadata);
    }
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Inicializa o Sentry para monitoramento em produção
   * Deve ser chamado no App.tsx após inicialização
   */
  initSentry(dsn: string, options?: Sentry.ReactNativeOptions): void {
    if (!dsn || dsn.trim().length === 0) {
      this.warn("Sentry DSN não fornecido. Monitoramento desabilitado.", "Logger");
      return;
    }

    try {
      Sentry.init({
        dsn,
        debug: this.isDevelopment,
        environment: this.isDevelopment ? 'development' : 'production',
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
        tracesSampleRate: this.isDevelopment ? 1.0 : 0.2, // 100% dev, 20% prod
        enableNative: true,
        enableNativeCrashHandling: true,
        attachStacktrace: true,
        autoInitializeNativeSdk: true,
        integrations: [
          Sentry.reactNativeTracingIntegration(),
        ],
        beforeSend: (event) => {
          // Filtrar eventos sensíveis (dados pessoais, tokens, etc)
          if (event.request?.headers) {
            delete event.request.headers['Authorization'];
            delete event.request.headers['authorization'];
          }
          return event;
        },
        ...options,
      });

      this.sentryInitialized = true;
      this.info("Sentry inicializado com sucesso", "Logger", {
        environment: this.isDevelopment ? 'development' : 'production',
      });
    } catch (error) {
      this.warn("Falha ao inicializar Sentry", "Logger", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Define o usuário atual para contexto no Sentry
   * Apenas ID é enviado (sem PII - Personally Identifiable Information)
   */
  setUser(userId: string): void {
    if (!this.sentryInitialized) return;

    try {
      Sentry.setUser({
        id: userId,
      });
      this.debug("Usuário definido no Sentry", "Logger", { userId });
    } catch (error) {
      this.warn("Falha ao definir usuário no Sentry", "Logger", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Remove o usuário atual do contexto do Sentry (logout)
   */
  clearUser(): void {
    if (!this.sentryInitialized) return;

    try {
      Sentry.setUser(null);
      this.debug("Usuário removido do Sentry", "Logger");
    } catch (error) {
      this.warn("Falha ao remover usuário do Sentry", "Logger", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Verifica se o Sentry está inicializado
   */
  isSentryInitialized(): boolean {
    return this.sentryInitialized;
  }
}

// Exportar instância singleton
export const logger = new Logger();
