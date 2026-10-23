import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Ocean Dark Cyberpunk Design Tokens
        cyber: {
          bg: "#020813",             // Primary deep cosmic backdrop
          surface: "#040e1c",        // Primary card and panel surface
          elevated: "#07162b",       // Modal, sliding dock, dropdown surface
          muted: "#0c1a2e",          // Message bubble, input field, chip background
          cyan: "#00e5ff",           // Neon cyan accent & primary brand glow
          blue: "#0284c7",           // Deep ocean blue gradient stop
          border: "rgba(0, 180, 255, 0.16)", // Standard glass border
          "border-glow": "rgba(0, 229, 255, 0.45)", // Focus & hover border
        },
        // Updated dark hierarchy aligned with Ocean Dark
        dark: {
          1: "#020813", // Deep cosmic black
          2: "#040e1c", // Dark surface
          3: "#07162b", // Elevated surface
          4: "#0c1a2e", // Muted surface
        },
        // Brand Royal/Ocean palette
        royal: {
          1: "#0284c7", // Ocean blue
          2: "#00b4d8", // Bright cyan-blue
          3: "#00e5ff", // Neon cyan
          4: "#38bdf8", // Sky highlight
        },
        accent: {
          1: "#00e5ff", // Primary cyan accent
          2: "#0284c7", // Deep cyan-blue
          3: "#38bdf8", // Light cyan
        },
        // Light mode colors
        light: {
          1: "#FFFFFF",
          2: "#FAFAFA",
          3: "#F5F5F5",
          4: "#E5E5E5",
        },
        blue: {
          1: "#00e5ff",
        },
        sky: {
          1: "rgba(0, 180, 255, 0.12)",
          2: "rgba(0, 229, 255, 0.2)",
          3: "rgba(0, 229, 255, 0.3)",
        },
        orange: {
          1: "#F59E0B",
        },
        purple: {
          1: "#8B5CF6",
        },
        yellow: {
          1: "#EAB308",
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 229, 255, 0.35)",
        "neon-blue": "0 0 20px rgba(2, 132, 199, 0.35)",
        "neon-amber": "0 0 20px rgba(245, 158, 11, 0.4)",
        "neon-red": "0 0 20px rgba(239, 68, 68, 0.45)",
        "glass-panel": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glass-elevated": "0 12px 40px 0 rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 180, 255, 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        hero: "url('/images/hero-background.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
