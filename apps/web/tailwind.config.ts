import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body:    ["var(--font-body)", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          base:     "var(--bg-base)",
          surface:  "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          overlay:  "var(--bg-overlay)",
          hover:    "var(--bg-hover)",
        },
        border: {
          DEFAULT: "var(--border)",
          light:   "var(--border-light)",
          glow:    "var(--border-glow)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dim:     "var(--accent-dim)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          dim:     "var(--amber-dim)",
        },
        status: {
          active:   "var(--status-active)",
          idle:     "var(--status-idle)",
          inactive: "var(--status-inactive)",
        },
        text: {
          primary:   "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted:     "var(--text-muted)",
          accent:    "var(--text-accent)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm:   "var(--shadow-sm)",
        md:   "var(--shadow-md)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "fade-in": "fadeIn 0.3s ease both",
        "shimmer": "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;