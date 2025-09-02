/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Color Hunt Palette - Primary Brand Colors
        primary: {
          50: "#fefdfb", // Very light warm white
          100: "#fef7e6", // Light cream
          200: "#fdecc2", // Light golden
          300: "#fbd999", // Soft golden
          400: "#f8c570", // Medium golden
          500: "#f0a500", // Main golden orange (from palette)
          600: "#cf7500", // Darker orange (from palette)
          700: "#a85f00", // Dark orange
          800: "#8a4f00", // Very dark orange
          900: "#6b3d00", // Darkest orange
        },
        // Neutral colors using the light gray from palette
        neutral: {
          50: "#fafafa", // Very light gray
          100: "#f4f4f4", // Light gray (from palette)
          200: "#e5e5e5", // Light gray
          300: "#d4d4d4", // Medium light gray
          400: "#a3a3a3", // Medium gray
          500: "#737373", // Medium dark gray
          600: "#525252", // Dark gray
          700: "#404040", // Darker gray
          800: "#262626", // Very dark gray
          900: "#000000", // Black (from palette)
        },
        // Success colors - using green tones that complement the orange
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // Warning colors - using the golden tones from our palette
        warning: {
          50: "#fefdfb",
          100: "#fef7e6",
          200: "#fdecc2",
          300: "#fbd999",
          400: "#f8c570",
          500: "#f0a500", // Same as primary-500
          600: "#cf7500", // Same as primary-600
          700: "#a85f00",
          800: "#8a4f00",
          900: "#6b3d00",
        },
        // Danger colors - using red tones that contrast well with orange
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        // Legacy support - map old colors to new ones
        blue: {
          50: "#fefdfb",
          100: "#fef7e6",
          200: "#fdecc2",
          300: "#fbd999",
          400: "#f8c570",
          500: "#f0a500",
          600: "#cf7500",
          700: "#a85f00",
          800: "#8a4f00",
          900: "#6b3d00",
        },
        gray: {
          50: "#fafafa",
          100: "#f4f4f4", // From palette
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#000000", // From palette
        },
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }] /* 12px */,
        sm: ["0.875rem", { lineHeight: "1.25rem" }] /* 14px */,
        base: ["1rem", { lineHeight: "1.5rem" }] /* 16px */,
        lg: ["1.125rem", { lineHeight: "1.75rem" }] /* 18px */,
        xl: ["1.25rem", { lineHeight: "1.75rem" }] /* 20px */,
        "2xl": ["1.5rem", { lineHeight: "2rem" }] /* 24px */,
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }] /* 30px */,
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }] /* 36px */,
      },
      spacing: {
        18: "4.5rem" /* 72px */,
        88: "22rem" /* 352px */,
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
