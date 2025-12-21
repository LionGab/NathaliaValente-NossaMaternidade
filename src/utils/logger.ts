/**
 * Logger centralizado para o app
 * Substitui console.log/error por sistema de logging controlado
 */

type LogLevel = "info" | "warn" | "error" | "debug";

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

  private formatMessage(message: string, context?: string): string {
    const prefix = context ? `[${context}]` : "";
    return `${prefix} ${message}`;
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
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
        case "info":
          // eslint-disable-next-line no-console -- Logger central, console.log intencional
          console.log(formattedMessage, metadata || "");
          break;
        case "warn":
          console.warn(formattedMessage, metadata || "");
          break;
        case "error":
          console.error(formattedMessage, error || "", metadata || "");
          break;
        case "debug":
          // eslint-disable-next-line no-console -- Logger central, console.debug intencional
          console.debug(formattedMessage, metadata || "");
          break;
      }
    }

    // Em produção, erros são apenas logados (Sentry removido)
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, context, undefined, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, context, undefined, metadata);
  }

  error(
    message: string,
    context?: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    this.log("error", message, context, error, metadata);
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log("debug", message, context, undefined, metadata);
    }
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

// Exportar instância singleton
export const logger = new Logger();
