/**
 * Sistema de Cores - Nossa Maternidade
 *
 * DEPRECADO: Este arquivo re-exporta de design-system.ts para compatibilidade.
 * TODO: Migrar todos os imports para usar design-system.ts diretamente
 *
 * Paleta oficial: Rosa vibrante #f4258c (design-system.ts)
 * Baseado em Apple HIG e Material Design 3
 */

import { COLORS, COLORS_DARK, GRADIENTS } from "../theme/design-system";

// Re-exporta colors do design system com compatibilidade
export const Colors = {
  // Cores Principais - Rosa Vibrante
  primary: {
    DEFAULT: COLORS.primary[500], // #f4258c
    50: COLORS.primary[50],
    100: COLORS.primary[100],
    200: COLORS.primary[200],
    300: COLORS.primary[300],
    400: COLORS.primary[400],
    500: COLORS.primary[500], // Main primary
    600: COLORS.primary[600],
    700: COLORS.primary[700],
    800: COLORS.primary[800],
    900: COLORS.primary[900],
  },

  // Cores Secundárias - Lilac/Purple
  secondary: {
    DEFAULT: COLORS.secondary[500],
    50: COLORS.secondary[50],
    100: COLORS.secondary[100],
    200: COLORS.secondary[200],
    300: COLORS.secondary[300],
    400: COLORS.secondary[400],
    500: COLORS.secondary[500], // Main secondary
    600: COLORS.secondary[600],
    700: COLORS.secondary[700],
    800: COLORS.secondary[800],
    900: COLORS.secondary[900],
  },

  // Azul Pastel Suave (mapeado para accent.sky)
  bluePastel: {
    DEFAULT: COLORS.legacyAccent.sky, // #BAE6FD
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: COLORS.legacyAccent.sky,
    600: "#0EA5E9",
    700: "#0284C7",
    800: "#0369A1",
    900: "#075985",
  },

  // Cores de Sentimentos (Daily Feelings) - Mapeado para semantic
  feeling: {
    sunny: {
      color: "#FFD89B", // Amarelo pastel - Bem
      activeColor: "#FFE5B8",
      label: "Bem",
    },
    cloud: {
      color: COLORS.legacyAccent.sky, // Azul pastel - Cansada
      activeColor: "#D4E9FD",
      label: "Cansada",
    },
    rainy: {
      color: COLORS.legacyAccent.lavender, // Roxo pastel - Enjoada
      activeColor: "#EDE9FE",
      label: "Enjoada",
    },
    heart: {
      color: COLORS.primary[400], // Rosa vibrante - Amada
      activeColor: COLORS.primary[300],
      label: "Amada",
    },
  },

  // Cores de Texto
  text: {
    dark: COLORS.neutral[900], // Cinza escuro para textos principais
    DEFAULT: COLORS.neutral[900],
    light: COLORS.neutral[600],
    muted: COLORS.neutral[500],
    white: "#ffffff",
  },

  // Cores de Fundo
  background: {
    DEFAULT: COLORS.background.primary, // #f8f5f7
    light: COLORS.background.secondary,
    soft: COLORS.background.tertiary,
    cream: COLORS.background.tertiary,
    blueTint: "#F0F9FF",
    pinkTint: COLORS.primary[50],
  },

  // Cores de Categorias
  category: {
    nutricao: COLORS.primary[400],
    exercicio: COLORS.legacyAccent.sky,
    saude: COLORS.legacyAccent.lavender,
    bemestar: COLORS.legacyAccent.peach,
  },

  // Gradientes
  gradients: {
    primary: GRADIENTS.primary,
    primarySoft: [COLORS.primary[400], COLORS.primary[200]],
    secondary: GRADIENTS.secondary,
    warm: GRADIENTS.warm,
    cool: GRADIENTS.cool,
    sunset: GRADIENTS.sunset,
  },

  // Cores de Status
  status: {
    success: COLORS.semantic.success,
    warning: COLORS.semantic.warning,
    error: COLORS.semantic.error,
    info: COLORS.semantic.info,
  },

  // Cores de UI
  ui: {
    border: COLORS.neutral[200],
    borderLight: COLORS.neutral[100],
    borderPink: COLORS.primary[200],
    borderBlue: COLORS.legacyAccent.sky,
    shadow: "rgba(244, 37, 140, 0.15)", // Sombra rosa vibrante
    shadowStrong: "rgba(244, 37, 140, 0.25)",
    shadowBlue: "rgba(186, 230, 253, 0.15)",
  },
} as const;

// Dark Mode Colors
export const ColorsDark = {
  primary: {
    DEFAULT: COLORS.primary[400],
    50: COLORS.neutral[900],
    100: COLORS.neutral[800],
    200: COLORS.neutral[700],
    300: COLORS.neutral[600],
    400: COLORS.primary[400],
    500: COLORS.primary[500],
    600: COLORS.primary[600],
    700: COLORS.primary[700],
    800: COLORS.primary[800],
    900: COLORS.primary[900],
  },

  secondary: {
    DEFAULT: COLORS.secondary[400],
    50: COLORS.neutral[900],
    100: COLORS.neutral[800],
    200: COLORS.neutral[700],
    300: COLORS.neutral[600],
    400: COLORS.secondary[400],
    500: COLORS.secondary[500],
    600: COLORS.secondary[600],
    700: COLORS.secondary[700],
    800: COLORS.secondary[800],
    900: COLORS.secondary[900],
  },

  bluePastel: {
    DEFAULT: COLORS.legacyAccent.sky,
    50: COLORS.neutral[900],
    100: COLORS.neutral[800],
    200: COLORS.neutral[700],
    300: COLORS.neutral[600],
    400: "#38BDF8",
    500: COLORS.legacyAccent.sky,
    600: "#7DD3FC",
    700: "#BAE6FD",
    800: "#E0F2FE",
    900: "#F0F9FF",
  },

  feeling: {
    sunny: {
      color: "#FFD89B",
      activeColor: "#FFE5B8",
      label: "Bem",
    },
    cloud: {
      color: COLORS.legacyAccent.sky,
      activeColor: "#D4E9FD",
      label: "Cansada",
    },
    rainy: {
      color: COLORS.legacyAccent.lavender,
      activeColor: "#EDE9FE",
      label: "Enjoada",
    },
    heart: {
      color: COLORS.primary[400],
      activeColor: COLORS.primary[300],
      label: "Amada",
    },
  },

  text: {
    dark: COLORS.neutral[100],
    DEFAULT: COLORS.neutral[100],
    light: COLORS.neutral[400],
    muted: COLORS.neutral[500],
    white: "#ffffff",
  },

  background: {
    DEFAULT: COLORS_DARK.background.primary,
    light: COLORS_DARK.background.secondary,
    soft: COLORS_DARK.background.tertiary,
    cream: COLORS_DARK.background.tertiary,
    blueTint: "#0F1419",
    pinkTint: "#1A0F14",
  },

  category: {
    nutricao: COLORS.primary[400],
    exercicio: COLORS.legacyAccent.sky,
    saude: COLORS.legacyAccent.lavender,
    bemestar: COLORS.legacyAccent.peach,
  },

  gradients: {
    primary: GRADIENTS.primary,
    primarySoft: [COLORS.primary[400], COLORS.primary[300]],
    secondary: GRADIENTS.secondary,
    warm: ["#2D1A1F", "#1A0F14"],
    cool: ["#0F1419", "#0A0F14"],
    sunset: GRADIENTS.sunset,
  },

  status: {
    success: COLORS.semantic.success,
    warning: COLORS.semantic.warning,
    error: COLORS.semantic.error,
    info: COLORS.semantic.info,
  },

  ui: {
    border: COLORS.neutral[700],
    borderLight: COLORS.neutral[800],
    borderPink: COLORS.primary[800],
    borderBlue: "#1F3F7A",
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    shadowBlue: "rgba(186, 230, 253, 0.1)",
  },
} as const;

// Helper para obter cores de sentimentos
export const getFeelingColor = (feeling: keyof typeof Colors.feeling) => {
  return Colors.feeling[feeling];
};

// Helper para gradientes
export const getGradient = (gradient: keyof typeof Colors.gradients) => {
  return Colors.gradients[gradient];
};

// Exportar cor primária como constante para uso rápido
export const PRIMARY_COLOR = Colors.primary.DEFAULT; // #f4258c
export const SECONDARY_COLOR = Colors.secondary.DEFAULT; // #A855F7
export const BLUE_PASTEL = Colors.bluePastel.DEFAULT; // #BAE6FD
export const BACKGROUND_COLOR = Colors.background.DEFAULT; // #f8f5f7
export const TEXT_DARK = Colors.text.dark;
