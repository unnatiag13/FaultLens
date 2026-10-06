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
          950: '#05070D',
          900: '#080B12',
          850: '#0B0F18',
          800: '#0B1220',
          750: '#0E172A',
          700: '#111827',
          600: '#1F2937',
          500: '#374151',
          400: '#4B5563',
          300: '#9CA3AF',
          200: '#E5E7EB',
          100: '#F3F4F6',
        },
        panel: {
          DEFAULT: '#0B1220',
          elevated: '#0E172A',
          border: '#1E293B',
          hover: '#162238',
        },
        brand: {
          primary: '#2563EB',
          primaryHover: '#1D4ED8',
          cyan: '#06B6D4',
          ai: '#8B5CF6',
          healthy: '#16A34A',
          healthyLight: 'rgba(22, 163, 74, 0.15)',
          warning: '#D97706',
          warningLight: 'rgba(217, 119, 6, 0.15)',
          critical: '#DC2626',
          criticalLight: 'rgba(220, 38, 38, 0.15)',
          neutral: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-ai': '0 0 25px -5px rgba(139, 92, 246, 0.25)',
        'glow-critical': '0 0 25px -5px rgba(220, 38, 38, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
