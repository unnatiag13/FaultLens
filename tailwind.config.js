/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050505',
          900: '#080808',
          850: '#0D0D0D',
          800: '#111111',
          750: '#141414',
          700: '#1A1A1A',
          600: '#222222',
          500: '#2E2E2E',
          400: '#3D3D3D',
          300: '#888888',
          200: '#CCCCCC',
          100: '#F0F0F0',
        },
        panel: {
          DEFAULT: '#0D0D0D',
          elevated: '#111111',
          border: '#1F1F1F',
          hover: '#181818',
        },
        brand: {
          primary: '#EA580C',
          primaryHover: '#C2410C',
          cyan: '#F97316',
          ai: '#FB923C',
          healthy: '#16A34A',
          healthyLight: 'rgba(22, 163, 74, 0.15)',
          warning: '#EAB308',
          warningLight: 'rgba(234, 179, 8, 0.15)',
          critical: '#DC2626',
          criticalLight: 'rgba(220, 38, 38, 0.15)',
          neutral: '#6B7280',
          orange: '#EA580C',
          orangeLight: 'rgba(234, 88, 12, 0.15)',
          orangeGlow: 'rgba(249, 115, 22, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(234, 88, 12, 0.35)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
        'glow-ai': '0 0 25px -5px rgba(251, 146, 60, 0.30)',
        'glow-critical': '0 0 25px -5px rgba(220, 38, 38, 0.3)',
        'glow-soft': '0 0 40px -10px rgba(234, 88, 12, 0.20)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(234, 88, 12, 0.3)' },
          '50%': { boxShadow: '0 0 35px -5px rgba(234, 88, 12, 0.55)' },
        },
      }
    },
  },
  plugins: [],
}
