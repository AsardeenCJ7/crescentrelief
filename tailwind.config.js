export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0B6E4F",
          50: "#E6F4EF",
          100: "#C3E4D6",
          500: "#0B6E4F",
          600: "#095F44",
          700: "#074F39",
        },
        secondary: {
          DEFAULT: "#00A86B",
          light: "#33BA89",
          dark: "#007A4E",
        },
        accent: {
          DEFAULT: "#FFC857",
          dark: "#E5B24D",
          light: "#FFD47A",
        },
        emergency: {
          DEFAULT: "#D62828",
          light: "#FDEAEA",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        card: "#FFFFFF",
        background: "#F8FAFC",
        "border-light": "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(2.5rem,5vw,4rem)", { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" }],
        "section": ["clamp(1.75rem,3vw,2.25rem)", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
        "card-title": ["1.25rem", { lineHeight: "1.3", fontWeight: "700" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "small": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "xs": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "section": "5rem",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)",
        "button": "0 1px 2px rgba(11,110,79,0.2), 0 4px 12px rgba(11,110,79,0.15)",
        "nav": "0 1px 0 rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "from": { opacity: "0", transform: "translateY(24px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "from": { opacity: "0" },
          "to": { opacity: "1" },
        },
        slideIn: {
          "from": { opacity: "0", transform: "translateX(-24px)" },
          "to": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
