/**
 * Tailwind Bridge - Calm FemTech 2025
 *
 * Exporta cores do preset calmFemtech para uso no tailwind.config.js
 * Fonte única de verdade para evitar divergências.
 *
 * Uso:
 * const colors = require('./src/theme/tailwind-bridge.cjs');
 * module.exports = { theme: { extend: { colors } } }
 */

// ===========================================
// BRAND COLORS
// ===========================================

const brand = {
  primary: {
    DEFAULT: "#6DA9E4",
    50: "#F0F7FF",
    100: "#DCEBFA",
    200: "#C4DEFA",
    300: "#9FC9F5",
    400: "#7DB9E8",
    500: "#6DA9E4",
    600: "#5A94D1",
    700: "#4A7DB8",
    800: "#3A6699",
    900: "#2D4F78",
  },
  accent: {
    DEFAULT: "#FF8BA3",
    50: "#FFF5F7",
    100: "#FFE8ED",
    200: "#FFD1DC",
    300: "#FFB3C4",
    400: "#FF8BA3",
    500: "#FF6B8A",
    600: "#E85A79",
    700: "#CC4A68",
    800: "#A33D55",
    900: "#7A2F42",
  },
  secondary: {
    DEFAULT: "#A855F7",
    50: "#FAF5FF",
    100: "#F3E8FF",
    200: "#E9D5FF",
    300: "#D8B4FE",
    400: "#C084FC",
    500: "#A855F7",
    600: "#9333EA",
    700: "#7C3AED",
    800: "#6B21A8",
    900: "#581C87",
  },
  teal: {
    DEFAULT: "#14B8A6",
    50: "#F0FDFA",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#134E4A",
  },
};

// ===========================================
// SURFACE & BACKGROUND
// ===========================================

const surface = {
  canvas: "#FFF8F3",
  base: "#F0F7FF",
  card: "#DCEBFA",
  elevated: "#FFFFFF",
};

const background = {
  DEFAULT: "#FFF8F3",
  primary: "#F0F7FF",
  secondary: "#FFFFFF",
  tertiary: "#E8F0F8",
  elevated: "#FFFFFF",
  card: "#DCEBFA",
};

// ===========================================
// TEXT COLORS
// ===========================================

const text = {
  dark: "#1A2A3A",
  DEFAULT: "#1A2A3A",
  light: "#4A5568",
  muted: "#6A5450",
  tertiary: "#718096",
  accent: "#CC4A68",
  link: "#4A7DB8",
  onAccent: "#1A2A3A", // Para texto sobre botão rosa
};

// ===========================================
// BORDER COLORS
// ===========================================

const border = {
  subtle: "#E2E8F0",
  DEFAULT: "#CBD5E0",
  strong: "#A0AEC0",
  accent: "#FF8BA3",
  primary: "#6DA9E4",
};

// ===========================================
// SEMANTIC COLORS
// ===========================================

const semantic = {
  success: "#10B981",
  successLight: "#D1FAE5",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  info: "#6DA9E4",
  infoLight: "#DCEBFA",
};

// ===========================================
// FEELING COLORS (Check-in emocional)
// ===========================================

const feeling = {
  bem: {
    DEFAULT: "#FFE4B5",
    light: "#FFEFC7",
  },
  cansada: {
    DEFAULT: "#BAE6FD",
    light: "#D4E9FD",
  },
  indisposta: {
    DEFAULT: "#DDD6FE",
    light: "#EDE9FE",
  },
  amada: {
    DEFAULT: "#FECDD3",
    light: "#FFE4E9",
  },
  ansiosa: {
    DEFAULT: "#FED7AA",
    light: "#FFE4C7",
  },
};

// ===========================================
// NEUTRAL COLORS
// ===========================================

const neutral = {
  0: "#FFFFFF",
  50: "#F9FAFB",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D1D5DB",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#1F2937",
  900: "#111827",
};

// ===========================================
// DARK MODE COLORS
// ===========================================

const dark = {
  primary: {
    DEFAULT: "#9FC9F5",
    50: "#0D1117",
    100: "#161B22",
    200: "#21262D",
    300: "#30363D",
    400: "#9FC9F5",
    500: "#7DB9E8",
    600: "#6DA9E4",
    700: "#5A94D1",
    800: "#4A7DB8",
    900: "#3A6699",
  },
  accent: {
    DEFAULT: "#FFB3C4",
    50: "#1A0A0F",
    100: "#2D1018",
    200: "#4D1A28",
    300: "#6D2438",
    400: "#FFB3C4",
    500: "#FF8BA3",
    600: "#FF6B8A",
    700: "#E85A79",
    800: "#CC4A68",
    900: "#A33D55",
  },
  text: {
    dark: "#F7FAFC",
    DEFAULT: "#F7FAFC",
    light: "#A0AEC0",
    muted: "#718096",
    accent: "#FFB3C4",
    link: "#9FC9F5",
    onAccent: "#1A2A3A",
  },
  background: {
    DEFAULT: "#0D1117",
    primary: "#161B22",
    secondary: "#21262D",
    tertiary: "#30363D",
    elevated: "#21262D",
  },
  neutral: {
    0: "#0D1117",
    50: "#161B22",
    100: "#21262D",
    200: "#30363D",
    300: "#3D444D",
    400: "#4D5666",
    500: "#6B7280",
    600: "#9CA3AF",
    700: "#D1D5DB",
    800: "#E5E7EB",
    900: "#F7FAFC",
  },
};

// ===========================================
// TYPOGRAPHY (Manrope)
// ===========================================

const fontFamily = {
  sans: ["Manrope_400Regular"],
  medium: ["Manrope_500Medium"],
  semibold: ["Manrope_600SemiBold"],
  bold: ["Manrope_700Bold"],
  extrabold: ["Manrope_800ExtraBold"],
};

// ===========================================
// EXPORTS
// ===========================================

module.exports = {
  // Light mode colors
  primary: brand.primary,
  accent: brand.accent,
  secondary: brand.secondary,
  teal: brand.teal,
  rose: brand.accent, // Legacy alias
  surface,
  background,
  text,
  border,
  semantic,
  feeling,
  neutral,

  // Dark mode override
  dark,

  // Typography
  fontFamily,

  // Legacy compat
  blush: {
    50: "#FDF8F6",
    100: "#FAF0ED",
    200: "#F5E1DB",
    300: "#EFD0C7",
    400: "#E8B4A5",
    500: "#D4A394",
    600: "#BC8B7B",
    700: "#9E7269",
    800: "#7A584F",
    900: "#5C4238",
  },
  cream: {
    50: "#FFF8F3",
    100: "#FFF3E8",
    200: "#FFEBD9",
    300: "#FFE0C7",
    400: "#FFD4B0",
    500: "#E8B88C",
    600: "#C9956A",
    700: "#A67548",
    800: "#7D5632",
    900: "#5C4228",
  },
  sage: {
    50: "#F6FAF7",
    100: "#ECF5EE",
    200: "#D5E8D9",
    300: "#B8D9BF",
    400: "#8FC49A",
    500: "#6BAD78",
    600: "#4F9260",
    700: "#3F7550",
    800: "#345E42",
    900: "#2A4C36",
  },
  warmGray: neutral,
};
