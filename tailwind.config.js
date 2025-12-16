/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const themeColors = require("./src/theme/tailwind-bridge.cjs");

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  corePlugins: {
    space: false,
  },
  theme: {
    // NOTE to AI: You can extend the theme with custom colors or styles here.
    extend: {
      colors: {
        // Nossa Maternidade - Sistema Calm FemTech 2025
        // Híbrido: Azul (base calm) + Rosa (accent CTA)
        //
        // Primary: Azul Pastel (calma, confiança, estrutura)
        primary: {
          DEFAULT: "#7DB9D5",
          50: "#F7FBFD",
          100: "#E8F3F9",
          200: "#DCE9F1",
          300: "#B4D7E8",
          400: "#96C7DE",
          500: "#7DB9D5",
          600: "#5BA3C7",
          700: "#4488AB",
          800: "#376E8C",
          900: "#2B576D",
        },
        // Accent: Rosa Vibrante (CTAs, warmth, destaques)
        accent: {
          DEFAULT: "#F4258C",
          50: "#FFF1F5",
          100: "#FFE4EC",
          200: "#FECDD6",
          300: "#FDA4B8",
          400: "#FB7190",
          500: "#F4258C",
          600: "#DB1F7D",
          700: "#B8196A",
          800: "#961456",
          900: "#7A1047",
        },
        // Secondary: Lilás/Roxo (apoio, meditação, introspecção)
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
        // Teal: Saúde, bem-estar físico
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
        // Rose (legacy compat - aponta para accent)
        rose: {
          50: "#FFF1F5",
          100: "#FFE4EC",
          200: "#FECDD6",
          300: "#FDA4B8",
          400: "#FB7190",
          500: "#F4258C",
          600: "#DB1F7D",
          700: "#B8196A",
          800: "#961456",
          900: "#7A1047",
        },
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
          50: "#f8f5f7",
          100: "#FFF9F3",
          200: "#FFF3E8",
          300: "#FFEBD9",
          400: "#FFE0C7",
          500: "#FFD4B0",
          600: "#E8B88C",
          700: "#C9956A",
          800: "#A67548",
          900: "#7D5632",
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
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        // Cores de sentimentos (Daily Feelings) - Pastéis suaves
        feeling: {
          bem: {
            DEFAULT: "#FFE4B5", // Amarelo pastel (sol)
            light: "#FFEFC7",
          },
          cansada: {
            DEFAULT: "#BAE6FD", // Azul pastel (nuvem)
            light: "#D4E9FD",
          },
          indisposta: {
            DEFAULT: "#DDD6FE", // Lavanda (chuva)
            light: "#EDE9FE",
          },
          amada: {
            DEFAULT: "#FECDD3", // Rosa pastel (coração)
            light: "#FFE4E9",
          },
          ansiosa: {
            DEFAULT: "#FED7AA", // Coral pastel
            light: "#FFE4C7",
          },
        },
        // Text colors - Hierarquia clara
        text: {
          dark: "#1F2937",
          DEFAULT: "#1F2937",
          light: "#6B7280",
          muted: "#9CA3AF",
          accent: "#F4258C",
          link: "#4488AB",
        },
        // Background colors - Azul pastel base
        background: {
          DEFAULT: "#F7FBFD",
          primary: "#F7FBFD",
          secondary: "#FFFFFF",
          tertiary: "#EDF4F8",
          elevated: "#FFFFFF",
        },
        // Neutral colors
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ["Manrope_400Regular"],
        medium: ["Manrope_500Medium"],
        semibold: ["Manrope_600SemiBold"],
        bold: ["Manrope_700Bold"],
        extrabold: ["Manrope_800ExtraBold"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "16px", letterSpacing: "0.01em" }],
        sm: ["13px", { lineHeight: "18px", letterSpacing: "0.01em" }],
        base: ["15px", { lineHeight: "22px", letterSpacing: "0" }],
        lg: ["17px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        xl: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em" }],
        "3xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        "5xl": ["48px", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "18": "72px",
        "22": "88px",
      },
    },
    // Dark mode colors - Azul escuro base (não preto puro)
    dark: {
      colors: {
        primary: {
          DEFAULT: "#8BC5DD",
          50: "#0F1419",
          100: "#1A2027",
          200: "#242D36",
          300: "#2F3B46",
          400: "#A8D4E8",
          500: "#8BC5DD",
          600: "#7DB9D5",
          700: "#5BA3C7",
          800: "#4488AB",
          900: "#376E8C",
        },
        accent: {
          DEFAULT: "#FB7190",
          50: "#1A0A12",
          100: "#2D0F1A",
          200: "#4D1A2E",
          300: "#6D2542",
          400: "#FB7190",
          500: "#F4258C",
          600: "#DB1F7D",
          700: "#B8196A",
          800: "#961456",
          900: "#7A1047",
        },
        secondary: {
          DEFAULT: "#C084FC",
          50: "#1A1025",
          100: "#2D1A3D",
          200: "#3D2A5A",
          300: "#5A3F8A",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6B21A8",
          900: "#581C87",
        },
        text: {
          dark: "#F3F5F7",
          DEFAULT: "#F3F5F7",
          light: "#9DA8B4",
          muted: "#7D8B99",
          accent: "#FB7190",
          link: "#96C7DE",
        },
        background: {
          DEFAULT: "#0F1419",
          primary: "#0F1419",
          secondary: "#1A2027",
          tertiary: "#242D36",
          elevated: "#1A2027",
        },
        neutral: {
          0: "#0F1419",
          50: "#1A2027",
          100: "#242D36",
          200: "#2F3B46",
          300: "#3D4A57",
          400: "#5C6B7A",
          500: "#7D8B99",
          600: "#9DA8B4",
          700: "#C7CED5",
          800: "#E2E7EC",
          900: "#F3F5F7",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      const spacing = theme("spacing");

      // space-{n}  ->  gap: {n}
      matchUtilities(
        { space: (value) => ({ gap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-x-{n}  ->  column-gap: {n}
      matchUtilities(
        { "space-x": (value) => ({ columnGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );

      // space-y-{n}  ->  row-gap: {n}
      matchUtilities(
        { "space-y": (value) => ({ rowGap: value }) },
        { values: spacing, type: ["length", "number", "percentage"] }
      );
    }),
  ],
};
