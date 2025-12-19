/**
 * Design System 2025 - Nossa Maternidade
 * Sistema de cores em 2 camadas: Paletas Base + Tokens Semânticos
 *
 * Princípios:
 * - Clean FemTech: poucas cores bem governadas
 * - Azul = identidade + calma (sempre presente, mas suave)
 * - Rosa = só CTA (raríssimo)
 * - Neutros = estrutura do layout
 * - Semânticas = estados (erro/sucesso) sem improviso
 *
 * Regras de Ouro:
 * 1. Rosa só em brand.accent (CTA primário, link crítico, badge raro)
 * 2. Fundo unificado: sempre surface.background (sem degradê no corpo)
 * 3. Cards: sempre surface.card + border.subtle (sombra mínima)
 * 4. Inputs: borda neutra; erro/sucesso só quando necessário
 */

import { Platform } from "react-native";

// ===========================================
// PALETAS BASE (SCALES)
// ===========================================

/**
 * Brand Blue (dominante) - base #7DB9D5
 * Transmite: acolhimento, segurança, calma, maternidade
 */
const BLUE = {
  50: "#F3FAFD",
  100: "#E6F3FA",
  200: "#CFE8F4",
  300: "#B8DCEC",
  400: "#9FCFE3",
  500: "#7DB9D5", // ← PRIMARY
  600: "#5EA3C2",
  700: "#4586A4",
  800: "#2F667F",
  900: "#1E465A",
} as const;

/**
 * Accent Pink (CTA apenas) - base #F4258C
 * USO RESTRITO: só CTAs primários, links de ação crítica, badges raros
 */
const PINK = {
  50: "#FFF0F7",
  100: "#FFE0EF",
  200: "#FFC2DF",
  300: "#FF94C8",
  400: "#FF5EAB",
  500: "#F4258C", // ← ACCENT
  600: "#D81C78",
  700: "#B01563",
  800: "#860F4B",
  900: "#5C0A33",
} as const;

/**
 * Neutral Cool (fundo unificado + UI clean)
 * Levemente azulados para complementar a paleta
 */
const NEUTRAL = {
  0: "#FFFFFF",
  50: "#F7FBFD", // ← surface.background
  100: "#EFF5F9",
  200: "#DEE7EF", // ← border.subtle
  300: "#C7D3DE", // ← border.strong
  400: "#A8B4C2",
  500: "#8694A6", // ← text.muted
  600: "#667588",
  700: "#4C5B6B", // ← text.secondary
  800: "#2B3642",
  900: "#121820", // ← text.primary
} as const;

// ===========================================
// COLORS EXPORT (Paletas base)
// ===========================================

export const COLORS = {
  // Escalas base (para uso direto quando necessário)
  primary: BLUE,
  secondary: BLUE, // Alias para compatibilidade
  accent: PINK,
  neutral: NEUTRAL,

  // =========================================
  // TOKENS SEMÂNTICOS - LIGHT MODE
  // =========================================

  // Superfícies
  background: {
    primary: NEUTRAL[50],    // #F7FBFD - fundo unificado clean
    secondary: NEUTRAL[0],   // #FFFFFF - cards
    tertiary: NEUTRAL[100],  // #EFF5F9 - separadores
    warm: NEUTRAL[50],       // Alias
    card: NEUTRAL[0],
    glass: "rgba(247, 251, 253, 0.85)",
    elevated: NEUTRAL[0],
  },

  // Superfícies temáticas (uso pontual)
  surface: {
    background: NEUTRAL[50],
    card: NEUTRAL[0],
    elevated: NEUTRAL[0],
    roseSoft: "#FDF0F0",
    peachSoft: "#FDF6F2",
    lilacBorder: "#E0D4F0",
    roseBorder: "#F5E0E0",
    blueBorder: "#D6E6F2",
  },

  // Bordas
  border: {
    subtle: NEUTRAL[200],    // #DEE7EF
    strong: NEUTRAL[300],    // #C7D3DE
    focus: BLUE[400],        // #9FCFE3
    error: "#EF4444",
  },

  // Texto
  text: {
    primary: NEUTRAL[900],   // #121820
    secondary: NEUTRAL[700], // #4C5B6B
    tertiary: NEUTRAL[500],  // #8694A6
    muted: NEUTRAL[500],
    inverse: "#F3F5F7",
    link: BLUE[600],
    error: "#EF4444",
  },

  // Brand
  brand: {
    primary: BLUE[500],       // #7DB9D5
    primaryStrong: BLUE[600], // #5EA3C2
    primarySoft: BLUE[100],   // #E6F3FA
    accent: PINK[500],        // #F4258C - SÓ CTA
    accentSoft: PINK[100],    // #FFE0EF
  },

  // Overlay
  overlay: {
    soft: "rgba(18, 24, 32, 0.06)",
    medium: "rgba(18, 24, 32, 0.18)",
    strong: "rgba(18, 24, 32, 0.40)",
    backdrop: "rgba(0, 0, 0, 0.4)",
  },

  // =========================================
  // SEMÂNTICAS DE ESTADO (mínimas e clean)
  // =========================================

  semantic: {
    success: "#22C55E",
    successLight: "#DCFCE7",
    warning: "#F59E0B",
    warningLight: "#FEF3C7",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    info: BLUE[600], // #5EA3C2
    infoLight: BLUE[100], // #E6F3FA
  },

  // =========================================
  // FEELING COLORS (Check-in Emocional)
  // =========================================

  feeling: {
    bem: "#FFE4B5",      // Amarelo pastel (sol)
    cansada: "#BAE6FD",  // Azul pastel (nuvem)
    indisposta: "#DDD6FE", // Lavanda (chuva)
    amada: "#FECDD3",    // Rosa pastel (coração)
  },

  // =========================================
  // MOOD COLORS (Daily Log)
  // =========================================

  mood: {
    happy: "#10B981",
    calm: "#6366F1",
    energetic: "#F59E0B",
    anxious: "#EF4444",
    sad: "#3B82F6",
    irritated: "#F97316",
    sensitive: "#EC4899",
    tired: "#8B5CF6",
  },

  // Legacy (compatibilidade)
  legacyAccent: {
    sage: "#86EFAC",
    peach: "#FED7AA",
    sky: "#BAE6FD",
    lavender: "#DDD6FE",
    coral: "#FECACA",
  },
} as const;

// ===========================================
// DARK MODE
// ===========================================

export const COLORS_DARK = {
  primary: {
    ...BLUE,
    400: "#9FCFE3", // Mais claro para contraste
    500: "#7DB9D5",
    600: "#5EA3C2",
  },

  secondary: {
    ...BLUE,
    400: "#9FCFE3",
    500: "#7DB9D5",
  },

  accent: {
    ...PINK,
    400: "#FF5EAB", // Mais vibrante em dark
    500: "#F4258C",
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
    primary: "#0F1419",
    secondary: "#141B22",
    tertiary: "#1A2430",
    warm: "#151C22",
    card: "#141B22",
    glass: "rgba(26, 32, 39, 0.85)",
    elevated: "#1A2430",
  },

  surface: {
    background: "#0F1419",
    card: "#141B22",
    elevated: "#1A2430",
    roseSoft: "rgba(253, 240, 240, 0.08)",
    peachSoft: "rgba(253, 246, 242, 0.08)",
    lilacBorder: "rgba(224, 212, 240, 0.15)",
    roseBorder: "rgba(245, 224, 224, 0.15)",
    blueBorder: "rgba(214, 230, 242, 0.15)",
  },

  border: {
    subtle: "rgba(243, 245, 247, 0.10)",
    strong: "rgba(243, 245, 247, 0.16)",
    focus: BLUE[400],
    error: "#F87171",
  },

  text: {
    primary: "#F3F5F7",
    secondary: "#9DA8B4",
    tertiary: "#7D8B99",
    muted: "#5C6B7A",
    inverse: "#1F2937",
    link: "#9FCFE3",
    error: "#F87171",
  },

  brand: {
    primary: BLUE[400],       // #9FCFE3 - mais legível
    primaryStrong: BLUE[500], // #7DB9D5
    primarySoft: "rgba(125, 185, 213, 0.15)",
    accent: PINK[400],        // #FF5EAB - CTA em dark
    accentSoft: "rgba(244, 37, 140, 0.15)",
  },

  overlay: {
    soft: "rgba(255, 255, 255, 0.06)",
    medium: "rgba(255, 255, 255, 0.14)",
    strong: "rgba(255, 255, 255, 0.24)",
    backdrop: "rgba(0, 0, 0, 0.6)",
  },

  semantic: {
    success: "#34D399",
    successLight: "rgba(16, 185, 129, 0.15)",
    warning: "#FBBF24",
    warningLight: "rgba(245, 158, 11, 0.15)",
    error: "#F87171",
    errorLight: "rgba(239, 68, 68, 0.15)",
    info: BLUE[400],
    infoLight: "rgba(125, 185, 213, 0.15)",
  },

  feeling: {
    bem: "rgba(255, 228, 181, 0.2)",
    cansada: "rgba(125, 185, 213, 0.25)",
    indisposta: "rgba(167, 139, 250, 0.2)",
    amada: "rgba(254, 205, 211, 0.2)",
  },

  mood: COLORS.mood,
  legacyAccent: COLORS.legacyAccent,
} as const;

// ===========================================
// TIPOGRAFIA
// ===========================================

export const TYPOGRAPHY = {
  // Display
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

  // Headline
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

  // Title
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

  // Body
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

  // Label
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

  sizes: {
    xs: 11,
    sm: 12,
    md: 13,
    base: 14,
    lg: 15,
    xl: 16,
    "2xl": 17,
    "3xl": 18,
    "4xl": 20,
    "5xl": 22,
    "6xl": 24,
    "7xl": 28,
    "8xl": 32,
  },
} as const;

// ===========================================
// ESPACAMENTO (8pt Grid)
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

function shadowToBoxShadow(
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number
): string {
  if (shadowColor === "transparent") return "none";
  const r = parseInt(shadowColor.slice(1, 3), 16);
  const g = parseInt(shadowColor.slice(3, 5), 16);
  const b = parseInt(shadowColor.slice(5, 7), 16);
  const color = `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
  return `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px ${color}`;
}

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
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  }),
  md: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  }),
  lg: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  }),
  xl: createWebCompatibleShadow({
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  }),
  glow: (color: string) =>
    createWebCompatibleShadow({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
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
  minTapTarget: 44,
  contrastRatio: 4.5,
  minTouchSpacing: 8,
} as const;

// ===========================================
// COMPONENTES PRE-DEFINIDOS
// ===========================================

export const COMPONENT_STYLES = {
  // Cards
  card: {
    backgroundColor: COLORS.surface.card,
    borderRadius: RADIUS["2xl"],
    borderWidth: 1,
    borderColor: COLORS.border.subtle,
    padding: SPACING["2xl"],
    ...SHADOWS.sm,
  },

  cardGlass: {
    ...GLASS.light,
    borderRadius: RADIUS["2xl"],
    padding: SPACING["2xl"],
    ...SHADOWS.sm,
  },

  cardOutlined: {
    backgroundColor: COLORS.surface.card,
    borderRadius: RADIUS["2xl"],
    borderWidth: 1,
    borderColor: COLORS.border.subtle,
    padding: SPACING["2xl"],
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: COLORS.brand.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  buttonAccent: {
    backgroundColor: COLORS.brand.accent,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.strong,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING["2xl"],
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  buttonGhost: {
    backgroundColor: "transparent",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: ACCESSIBILITY.minTapTarget,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  // Inputs
  input: {
    backgroundColor: COLORS.surface.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.subtle,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    minHeight: ACCESSIBILITY.minTapTarget + 8,
    fontSize: TYPOGRAPHY.bodyLarge.fontSize,
  },

  inputFocused: {
    borderColor: COLORS.border.focus,
    borderWidth: 1,
  },

  // Chips
  chip: {
    backgroundColor: COLORS.brand.primarySoft,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 32,
  },

  chipAccent: {
    backgroundColor: COLORS.brand.accentSoft,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 32,
  },

  // Navigation
  tabBar: {
    backgroundColor: "rgba(247, 251, 253, 0.95)",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border.subtle,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },

  header: {
    backgroundColor: COLORS.surface.background,
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
  },
} as const;

// ===========================================
// GRADIENTES
// ===========================================

export const GRADIENTS = {
  // Brand (uso mínimo)
  primary: [BLUE[500], BLUE[600]],
  primarySoft: [BLUE[50], BLUE[100]],
  accent: [PINK[400], PINK[500]],
  accentSoft: [PINK[50], PINK[100]],

  // Mood
  warm: [NEUTRAL[50], "#FFFFFF", NEUTRAL[100]],
  cool: [BLUE[100], BLUE[50], "#FFFFFF"],

  // Hero (uso pontual)
  heroLight: [NEUTRAL[50], "#FFFFFF", NEUTRAL[100]],
  heroSoft: [BLUE[100], BLUE[50], "#FFFFFF"],

  // Overlays
  overlayWarm: ["rgba(247, 251, 253, 0.95)", "rgba(255, 255, 255, 0.9)"],
  overlayCool: ["rgba(230, 243, 250, 0.95)", "rgba(255, 255, 255, 0.9)"],
  overlayDark: ["rgba(26, 32, 39, 0.95)", "rgba(15, 20, 25, 0.9)"],

  // Utility
  glass: ["rgba(255,255,255,0.8)", "rgba(247,251,253,0.4)"],
  shimmer: ["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0)"],

  // Semantic
  successGradient: ["#10B981", "#5A9D68", "#4A8C58"],
  streakBg: "#FEF3C7",
  streakIcon: "#F59E0B",
  streakText: "#B45309",
  completionLight: "#D4EDD9",
  completionMedium: "#A7D4B4",

  // Feature-specific
  breathing: {
    box: {
      color: "#60A5FA",
      bgColors: ["#DBEAFE", "#BFDBFE", "#93C5FD"] as const,
    },
    technique478: {
      bgColors: ["#EDE9FE", "#DDD6FE", "#C4B5FD"] as const,
    },
    calm: {
      bgColors: ["#DCFCE7", "#BBF7D0", "#86EFAC"] as const,
    },
  },

  nathiaOnboarding: ["#FFF5F7", "#FEF3F2"] as const,
  paywallPink: ["#FDF2F8", "#FCE7F3", "#FBCFE8"] as const,

  cycle: {
    fertile: "#F472B6",
    menstrual: "#E11D48",
    follicular: "#8B5CF6",
    ovulation: "#A855F7",
    luteal: "#EC4899",
  },

  rest: {
    bgPrimary: "#1F2937",
    bgSecondary: "#111827",
    iconBg: "#374151",
    infoIcon: "#C084FC",
  },

  notification: {
    morning: "#F59E0B",
    checkIn: "#10B981",
    evening: "#6366F1",
  },

  // Sunset (warm tones for special moments)
  sunset: [PINK[400], "#F97316", "#FBBF24"] as const,

  // Legacy
  aurora: [BLUE[500], BLUE[600], "#14B8A6"],
  heroPrimary: [BLUE[400], BLUE[500], BLUE[600]],
  secondary: [BLUE[400], BLUE[500]],
  secondarySoft: [BLUE[100], BLUE[200]],
} as const;

// ===========================================
// AFFIRMATION GRADIENTS
// ===========================================

export const AFFIRMATION_GRADIENTS = [
  { colors: ["#1E3A5F", "#2D5A87", "#3B7AB0"] as const, name: "Oceano" },
  { colors: ["#4A1942", "#6B2D5C", "#8B4177"] as const, name: "Ametista" },
  { colors: ["#1A3C34", "#2D5C4A", "#3F7D61"] as const, name: "Floresta" },
  { colors: ["#3D2914", "#5C3D1E", "#7A5128"] as const, name: "Terra" },
  { colors: ["#2E1065", "#4C1D95", "#6D28D9"] as const, name: "Cosmos" },
] as const;

// ===========================================
// ELEVATION
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
// OVERLAY
// ===========================================

export const OVERLAY = {
  backdrop: "rgba(0, 0, 0, 0.4)",
  backdropStrong: "rgba(0, 0, 0, 0.5)",
  backdropLight: "rgba(0, 0, 0, 0.3)",
  scrim: "rgba(0, 0, 0, 0.6)",
  light: "rgba(255, 255, 255, 0.9)",
  blueLight: "rgba(247, 251, 253, 0.95)",
  blueDark: "rgba(15, 20, 25, 0.95)",
  hoverLight: "rgba(0, 0, 0, 0.04)",
  hoverDark: "rgba(255, 255, 255, 0.08)",
  pressLight: "rgba(0, 0, 0, 0.08)",
  pressDark: "rgba(255, 255, 255, 0.12)",
  disabled: "rgba(0, 0, 0, 0.12)",
  disabledDark: "rgba(255, 255, 255, 0.12)",
  white: {
    subtle: "rgba(255, 255, 255, 0.02)",
    faint: "rgba(255, 255, 255, 0.03)",
    soft: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.15)",
    strong: "rgba(255, 255, 255, 0.2)",
    muted: "rgba(255, 255, 255, 0.3)",
    semiTransparent: "rgba(255, 255, 255, 0.5)",
    prominent: "rgba(255, 255, 255, 0.6)",
    text: "rgba(255, 255, 255, 0.7)",
    textStrong: "rgba(255, 255, 255, 0.8)",
  },
} as const;

// ===========================================
// INTERACTIVE STATES
// ===========================================

export const INTERACTIVE = {
  pressedOpacity: 0.7,
  pressedScale: 0.96,
  feedbackDuration: 150,
} as const;

// ===========================================
// LAYOUT
// ===========================================

export const LAYOUT = {
  screenPaddingHorizontal: SPACING["2xl"],
  screenPaddingVertical: SPACING["2xl"],
  sectionGap: SPACING["4xl"],
  cardGap: SPACING.lg,
  heroHeight: {
    small: 180,
    medium: 240,
    large: 320,
  },
} as const;
