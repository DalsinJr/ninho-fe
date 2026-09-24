import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

// Tokens do Design System "Águia" (SPEC §9.5).
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        display: ['"Nunito Sans"', "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        azul: {
          50: "#EEF3FB", 100: "#D6E2F4", 200: "#A9C0E7", 300: "#7B9DD9", 400: "#4370BC",
          500: "#0E4194", 600: "#0C3A85", 700: "#0A3070", 800: "#072556", 900: "#051A3D",
          DEFAULT: "#0E4194",
        },
        vermelho: {
          50: "#FDEFEF", 100: "#F9D6D5", 200: "#EFA8A7", 300: "#E07B79", 400: "#C94240",
          500: "#AF1817", 600: "#9A1514", 700: "#7E1110", 800: "#620D0C", 900: "#470908",
          DEFAULT: "#AF1817",
        },
        neutro: {
          50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8",
          500: "#64748B", 600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ia: {
          adequado: "hsl(var(--ia-adequado))",
          "nao-adequado": "hsl(var(--ia-nao-adequado))",
          inconclusivo: "hsl(var(--ia-inconclusivo))",
          fundo: "hsl(var(--ia-fundo))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // R7: só opacity, translateY até 8 px e scale entre 0,98 e 1,02.
        "entrar": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulsar": { "0%, 100%": { transform: "scale(0.98)" }, "50%": { transform: "scale(1.02)" } },
      },
      animation: {
        entrar: "entrar 0.3s ease-out",
        pulsar: "pulsar 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
