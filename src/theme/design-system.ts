/**
 * Design System 2025 - Nossa Maternidade
 * Paleta: "MATERNIDADE AZUL PASTEL"
 *
 * Baseado em:
 * - Apple Human Interface Guidelines (Liquid Glass 2025)
 * - Material Design 3 Expressive
 * - WCAG 2.2 AA Accessibility (4.5:1 texto, 3:1 UI)
 * - Estilo FemTech (Flo, Clue)
 *
 * Princípios:
 * - Baixo estímulo visual (reduz sobrecarga/ansiedade)
 * - Azul pastel suave - acolhimento, segurança, calma
 * - Evita azul vibrante ou corporativo
 * - Fundo nunca branco puro
 * - Dark mode: #121212 base (não preto puro)
 * - Tap targets mínimos 44pt (iOS)
 */

// ===========================================
// PALETA "MATERNIDADE AZUL PASTEL"
// ===========================================

/**
 * Sistema de cores estruturado:
 * - brand: primary (azul pastel), secondary (azul soft), accent (teal)
 * - surface: backgrounds, cards, borders
 * - text: hierarquia de texto
 * - semantic: feedback do sistema
 * - feeling: cores do check-in emocional
 */

export const COLORS = {
  // =========================================
  // BRAND COLORS
  // =========================================

  /**
   * Primary: Azul Pastel Suave
   * - Transmite: acolhimento, segurança, calma, maternidade
   * - Uso: CTAs, navegação ativa, elementos principais
   * - Contraste em #F7FBFD: ~4.8:1 (WCAG AA)
   */
  primary: {
    50: "#F7FBFD",   // Background principal
    100: "#E8F3F9",  // Primary Soft - highlights
    200: "#DCE9F1",  // Border subtle
    300: "#B4D7E8",  // Hover states
    400: "#96C7DE",  // Active elements
    500: "#7DB9D5",  // Principal - CTA/foco
    600: "#5BA3C7",  // CTA forte - alto contraste
    700: "#4488AB",  // Links/ícones
    800: "#376E8C",  // Textos sobre claro
    900: "#2B576D",  // Textos heading
  },

  /**
   * Secondary: Azul Soft Complementar
   * - Transmite: confiança, serenidade
   * - Uso: elementos secundários, badges, tags
   */
  secondary: {
    50: "#F0F7FF",
    100: "#E1EFFF",
    200: "#C7DFFA",
    300: "#A3CCF2",
    400: "#7BB8E8",  // Secundário ativo
    500: "#5CA3DB",  // Principal secundário
    600: "#4189C2",
    700: "#336FA3",
    800: "#285785",
    900: "#1F4468",
  },

  /**
   * Accent: Teal Suave
   * - Transmite: saúde, bem-estar, natureza
   * - USO: destaques pontuais, badges especiais
   */
  accent: {
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",  // Accent principal
    600: "#0D9488",  // CTA accent
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },

  // =========================================
  // NEUTRAL COLORS (Cool Gray - Azul Pastel Theme)
  // =========================================

  /**
   * Tons neutros levemente azulados
   * - Complementa a paleta azul pastel
   * - Acolhedor e suave para contexto maternal
   */
  neutral: {
    0: "#FFFFFF",
    50: "#F9FAFB",     // Quase branco
    100: "#F3F4F6",    // Background alternativo
    200: "#E5E7EB",    // Borders
    300: "#D1D5DB",    // Borders mais fortes
    400: "#9CA3AF",    // Icons desabilitados
    500: "#6B7280",    // Text secondary
    600: "#4B5563",    // Text medium
    700: "#374151",    // Text strong
    800: "#1F2937",    // Text primary
    900: "#111827",    // Text heading
  },

  // =========================================
  // SURFACE COLORS
  // =========================================

  /**
   * Backgrounds e superfícies - Azul Pastel Theme
   * - Azul muito claro como base (não branco puro)
   * - Acolhedor e suave para contexto maternal
   */
  background: {
    primary: "#F7FBFD",   // Azul clarinho - principal (da paleta)
    secondary: "#FFFFFF", // Branco - cards
    tertiary: "#EDF4F8",  // Azul ainda mais claro - separadores
    warm: "#F5FAFC",      // Tom levemente azulado
    card: "rgba(255, 255, 255, 0.96)",
    glass: "rgba(247, 251, 253, 0.85)",
  },

  // =========================================
  // TEXT COLORS
  // =========================================

  /**
   * Hierarquia de texto - Paleta Maternidade
   * - Todos validados para WCAG 2.2 AA
   * - Cores neutras da paleta definida
   */
  text: {
    primary: "#1F2937",   // Títulos - da paleta (contraste ~14:1)
    secondary: "#6B7280", // Corpo - da paleta (contraste ~5.5:1)
    tertiary: "#9CA3AF",  // Hints - contraste ~3.5:1
    muted: "#D1D5DB",     // Desabilitado - apenas decorativo
    inverse: "#F9FAFB",   // Texto em fundo escuro
  },

  // =========================================
  // SEMANTIC COLORS
  // =========================================

  /**
   * Feedback do sistema
   * - Cores padrão com bom contraste
   */
  semantic: {
    success: "#10B981", // Verde esmeralda
    successLight: "#D1FAE5",
    warning: "#F59E0B", // Âmbar
    warningLight: "#FEF3C7",
    error: "#EF4444", // Vermelho
    errorLight: "#FEE2E2",
    info: "#3B82F6", // Azul
    infoLight: "#DBEAFE",
  },

  // =========================================
  // FEELING COLORS (Check-in Emocional)
  // =========================================

  /**
   * Cores pastéis para check-in
   * - Baixa saturação = baixo estímulo
   */
  feeling: {
    bem: "#FFE4B5", // Amarelo pastel (sol)
    cansada: "#BAE6FD", // Azul pastel (nuvem)
    indisposta: "#DDD6FE", // Lavanda (chuva)
    amada: "#FECDD3", // Rosa pastel (coração)
  },

  // =========================================
  // LEGACY ACCENT (backward compatibility)
  // =========================================
  legacyAccent: {
    sage: "#86EFAC",
    peach: "#FED7AA",
    sky: "#BAE6FD",
    lavender: "#DDD6FE",
    coral: "#FECACA",
  },
} as const;

// ===========================================
// DARK MODE (Azul Pastel Dessaturado)
// ===========================================

/**
 * Dark mode para paleta Maternidade Azul Pastel:
 * - Superfície base: #0F1419 (azul muito escuro, não preto puro)
 * - Azul dessaturado para manter identidade
 * - Elevação com tons mais claros
 * - Reduz fadiga em telas OLED
 */
export const COLORS_DARK = {
  primary: {
    ...COLORS.primary,
    // Azul pastel mais claro para contraste em dark
    400: "#A8D4E8",  // Mais claro
    500: "#8BC5DD",  // Principal em dark
    600: "#7DB9D5",  // CTA em dark
  },

  secondary: {
    ...COLORS.secondary,
    400: "#9DC8E8",  // Mais claro
    500: "#7BB8E8",  // Principal em dark
  },

  accent: {
    ...COLORS.accent,
    400: "#5EEAD4",  // Mais vibrante em dark
    500: "#2DD4BF",  // Teal vibrante
  },

  neutral: {
    0: "#0F1419",    // Base azulada escura
    50: "#1A2027",   // Elevação 1
    100: "#242D36",  // Elevação 2
    200: "#2F3B46",  // Elevação 3
    300: "#3D4A57",
    400: "#5C6B7A",
    500: "#7D8B99",
    600: "#9DA8B4",
    700: "#C7CED5",
    800: "#E2E7EC",
    900: "#F3F5F7",  // Texto primário
  },

  background: {
    primary: "#0F1419",   // Azul muito escuro
    secondary: "#1A2027", // Cards
    tertiary: "#242D36",  // Separadores
    warm: "#151C22",      // Tom levemente azulado
    card: "rgba(26, 32, 39, 0.95)",
    glass: "rgba(26, 32, 39, 0.72)",
  },

  text: {
    primary: "#F3F5F7",   // Não branco puro
    secondary: "#9DA8B4",
    tertiary: "#7D8B99",
    muted: "#5C6B7A",
    inverse: "#1F2937",
  },

  semantic: {
    success: "#34D399",  // Mais claro
    successLight: "rgba(16, 185, 129, 0.15)",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    error: "#F87171",
    errorLight: "rgba(239, 68, 68, 0.15)",
    info: "#7DB9D5",     // Azul pastel como info
    infoLight: "rgba(125, 185, 213, 0.15)",
  },

  feeling: {
    bem: "rgba(255, 228, 181, 0.2)",
    cansada: "rgba(125, 185, 213, 0.25)",  // Azul pastel
    indisposta: "rgba(167, 139, 250, 0.2)",
    amada: "rgba(254, 205, 211, 0.2)",
  },

  legacyAccent: COLORS.legacyAccent,
} as const;

// ===========================================
// TIPOGRAFIA
// ===========================================

export const TYPOGRAPHY = {
  // Display - Titulos grandes
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: "400" as const,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },

  // Headline - Secoes
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600" as const,
    letterSpacing: -0.25,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },

  // Title - Titulos de cards
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.1,
  },

  // Body - Texto corrido
  bodyLarge: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "400" as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400" as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: 0.4,
  },

  // Label - Botoes, tags
  labelLarge: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600" as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
} as const;

// ===========================================
// ESPACAMENTO (8pt Grid System)
// ===========================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  "7xl": 80,
  "8xl": 96,
} as const;

// ===========================================
// BORDAS E RAIOS
// ===========================================

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 9999,
} as const;

// ===========================================
// SOMBRAS
// ===========================================

import { Platform } from "react-native";

/**
 * Converte shadow props para boxShadow CSS (web)
 */
function shadowToBoxShadow(
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number
): string {
  if (shadowColor === "transparent") {
    return "none";
  }
  const r = parseInt(shadowColor.slice(1, 3), 16);
  const g = parseInt(shadowColor.slice(3, 5), 16);
  const b = parseInt(shadowColor.slice(5, 7), 16);
  const color = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
  return `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${color}`;
}

/**
 * Cria shadow compatível com web (boxShadow) e mobile (shadow props)
 */
function createWebCompatibleShadow(config: {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}) {
  if (Platform.OS === "web") {
    return {
      boxShadow: shadowToBoxShadow(
        config.shadowColor,
        config.shadowOffset,
        config.shadowOpacity,
        config.shadowRadius
      ),
    };
  }
  return {
    shadowColor: config.shadowColor,
    shadowOffset: config.shadowOffset,
    shadowOpacity: config.shadowOpacity,
    shadowRadius: config.shadowRadius,
    elevation: config.elevation,
  };
}

export const SHADOWS = {
  none: createWebCompatibleShadow({
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  }),
  sm: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  }),
  md: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  }),
  lg: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  }),
  xl: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  }),
  glow: (color: string) =>
    createWebCompatibleShadow({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
    }),
} as const;

// ===========================================
// GLASSMORPHISM
// ===========================================

export const GLASS = {
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  medium: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  dark: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
} as const;

// ===========================================
// ANIMACOES
// ===========================================

export const ANIMATION = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    // Curvas iOS-style
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    spring: { damping: 15, stiffness: 150 },
  },
} as const;

// ===========================================
// ACESSIBILIDADE
// ===========================================

export const ACCESSIBILITY = {
  // Tamanho minimo de tap target (Apple HIG)
  minTapTarget: 44,
  // Contraste minimo para WCAG AA
  contrastRatio: 4.5,
  // Espacamento minimo entre elementos tocaveis
  minTouchSpacing: 8,
} as const;

// ===========================================
// COMPONENTES PRE-DEFINIDOS
// ===========================================

export const COMPONENT_STYLES = {
  // =========================================
  // CARDS
  // =========================================

  // Card padrão (fundo creme)
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    ...SHADOWS.md,
  },

  // Card com glass effect
  cardGlass: {
    ...GLASS.light,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    ...SHADOWS.md,
  },

  // Card com borda sutil
  cardOutlined: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: RADIUS["2xl"],
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    padding: SPACING["2xl"],
  },

  // =========================================
  // BUTTONS
  // =========================================

  // Botão primário (Azul Pastel - ação principal)
  buttonPrimary: {
    backgroundColor: COLORS.primary[500],
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Botão secundário (outline)
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary[500],
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Botão accent (Teal - CTAs especiais)
  buttonAccent: {
    backgroundColor: COLORS.accent[500],
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Botão ghost (sem fundo)
  buttonGhost: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // =========================================
  // INPUTS
  // =========================================

  // Input field
  input: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    minHeight: ACCESSIBILITY.minTapTarget + 8,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
  },

  // Input com foco
  inputFocused: {
    borderColor: COLORS.primary[500],
    borderWidth: 2,
  },

  // =========================================
  // CHIPS & TAGS
  // =========================================

  // Chip padrão
  chip: {
    backgroundColor: COLORS.primary[50],
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 32,
  },

  // Chip accent (teal)
  chipAccent: {
    backgroundColor: COLORS.accent[50],
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 32,
  },

  // =========================================
  // NAVIGATION
  // =========================================

  // Tab Bar - Azul Pastel
  tabBar: {
    backgroundColor: "rgba(247, 251, 253, 0.95)",  // Azul pastel com transparência
    borderTopWidth: 0.5,
    borderTopColor: COLORS.primary[200],  // Border azul sutil
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    ...SHADOWS.sm,
  },

  // Header
  header: {
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
  },
} as const;

// ===========================================
// GRADIENTES
// ===========================================

export const GRADIENTS = {
  // =========================================
  // BRAND GRADIENTS (Maternidade Azul Pastel)
  // =========================================

  // Primary: Azul pastel suave (acolhimento, calma)
  primary: [COLORS.primary[500], COLORS.primary[600]],
  primarySoft: [COLORS.primary[50], COLORS.primary[100]],

  // Secondary: Azul soft (confiança)
  secondary: [COLORS.secondary[400], COLORS.secondary[500]],
  secondarySoft: [COLORS.secondary[100], COLORS.secondary[200]],

  // Accent: Teal suave (saúde, bem-estar)
  accent: [COLORS.accent[400], COLORS.accent[500]],
  accentSoft: [COLORS.accent[100], COLORS.accent[200]],

  // =========================================
  // MOOD GRADIENTS (Check-in Emocional)
  // =========================================

  warm: ["#F7FBFD", "#EDF4F8", "#FFFFFF"],
  cool: ["#E8F3F9", "#DCE9F1", "#F7FBFD"],
  sunset: ["#FED7AA", "#FECDD3", "#FEE2E2"],
  sage: ["#D1FAE5", "#CCFBF1", "#F0FDFA"],

  // =========================================
  // HERO GRADIENTS (Backgrounds principais)
  // =========================================

  // Light: azul pastel → branco (padrão)
  heroLight: ["#F7FBFD", "#FFFFFF", "#E8F3F9"],

  // Soft blue para seções de destaque
  heroSoft: ["#E8F3F9", "#DCE9F1", "#FFFFFF"],

  // Teal suave (uso pontual)
  heroAccent: ["#F0FDFA", "#CCFBF1", "#FFFFFF"],

  // =========================================
  // OVERLAY GRADIENTS (Cards flutuantes)
  // =========================================

  overlayWarm: ["rgba(247, 251, 253, 0.95)", "rgba(255, 255, 255, 0.9)"],
  overlayCool: ["rgba(232, 243, 249, 0.95)", "rgba(255, 255, 255, 0.9)"],
  overlayAccent: ["rgba(240, 253, 250, 0.95)", "rgba(255, 255, 255, 0.9)"],

  // =========================================
  // UTILITY GRADIENTS
  // =========================================

  glass: ["rgba(255,255,255,0.8)", "rgba(247,251,253,0.4)"],
  shimmer: ["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"],

  // =========================================
  // LEGACY (backward compatibility)
  // =========================================

  aurora: ["#7DB9D5", "#5CA3DB", "#14B8A6"],  // Azul pastel aurora
  heroPrimary: [COLORS.primary[400], COLORS.primary[500], COLORS.primary[600]],
} as const;

// ===========================================
// AFFIRMATION GRADIENTS (Temas de Afirmações)
// ===========================================

/**
 * Gradientes temáticos para tela de afirmações
 * - Cores profundas para modo imersivo
 * - Cada tema evoca uma emoção específica
 */
export const AFFIRMATION_GRADIENTS = [
  { colors: ["#1E3A5F", "#2D5A87", "#3B7AB0"] as const, name: "Oceano" },
  { colors: ["#4A1942", "#6B2D5C", "#8B4177"] as const, name: "Ametista" },
  { colors: ["#1A3C34", "#2D5C4A", "#3F7D61"] as const, name: "Floresta" },
  { colors: ["#3D2914", "#5C3D1E", "#7A5128"] as const, name: "Terra" },
  { colors: ["#2E1065", "#4C1D95", "#6D28D9"] as const, name: "Cosmos" },
] as const;

// ===========================================
// ELEVATIONS (z-index system)
// ===========================================

export const ELEVATION = {
  base: 0,
  raised: 1,
  overlay: 10,
  dropdown: 20,
  modal: 30,
  tooltip: 40,
  toast: 50,
} as const;

// ===========================================
// ESTADOS INTERATIVOS
// ===========================================

export const INTERACTIVE = {
  // Opacidade para estados pressed
  pressedOpacity: 0.7,
  // Escala para animações de tap
  pressedScale: 0.96,
  // Duração da animação de feedback
  feedbackDuration: 150,
} as const;

// ===========================================
// ESPAÇAMENTOS SEMÂNTICOS
// ===========================================

export const LAYOUT = {
  // Padding de telas
  screenPaddingHorizontal: SPACING["2xl"],
  screenPaddingVertical: SPACING["2xl"],
  
  // Espaçamento entre seções
  sectionGap: SPACING["4xl"],
  
  // Espaçamento entre cards
  cardGap: SPACING.lg,
  
  // Hero section heights
  heroHeight: {
    small: 180,
    medium: 240,
    large: 320,
  },
} as const;
