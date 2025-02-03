import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'noto-sans': ['Noto Sans', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'draw': 'draw 4s ease-in-out infinite',
      },
      keyframes: {
        draw: {
          '0%': { strokeDasharray: '0 1000', opacity: '0.3' },
          '50%': { strokeDasharray: '1000 1000', opacity: '1' },
          '100%': { strokeDasharray: '1000 1000', opacity: '0.3' }
        },
        coinFloat: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' }
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
