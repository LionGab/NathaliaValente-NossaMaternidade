/**
 * Formatters
 *
 * Funções utilitárias para formatação de dados
 */

/**
 * Formata uma data para exibição relativa (ex: "há 1h", "há 2 dias")
 */
export function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "agora";
  if (minutes === 1) return "há 1 min";
  if (minutes < 60) return `há ${minutes} min`;
  if (hours === 1) return "há 1h";
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return "há 1 dia";
  if (days < 7) return `há ${days} dias`;
  if (weeks === 1) return "há 1 semana";
  if (weeks < 4) return `há ${weeks} semanas`;
  if (months === 1) return "há 1 mês";
  return `há ${months} meses`;
}

/**
 * Formata um número grande para exibição compacta (ex: 1.2k, 5M)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
}

/**
 * Trunca um texto no tamanho especificado com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
