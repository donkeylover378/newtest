import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#0F172A",
        cream: "#FBF7EC",
        terracotta: { DEFAULT: "#C8553D", light: "#E08A76", dark: "#A84532" },
        gold: { DEFAULT: "#B8924C", light: "#D2AE63", dark: "#9A7A3F" },
        forest: { DEFAULT: "#4F7A52", light: "#6B9A6E", dark: "#3B5E3E" },
        amber: { DEFAULT: "#B47B36", light: "#CFA05E", dark: "#8E6129" },
        rose: { DEFAULT: "#B23A48", light: "#D05A66", dark: "#8E2E3A" },
        border: "var(--border)",
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
      },
      fontFamily: {
        serif: ["Spectral", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 200ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
        "scale-in": "scaleIn 150ms ease-out",
        "shimmer": "shimmer 1.5s ease-in-out infinite",
        "pulse-gold": "pulseGold 600ms ease-in-out",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInRight: { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.97)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGold: { "0%, 100%": { boxShadow: "0 0 0 0 rgba(184,146,76,0)" }, "50%": { boxShadow: "0 0 0 4px rgba(184,146,76,0.3)" } },
      },
    },
  },
  plugins: [],
};

export default config;
