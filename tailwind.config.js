
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090B',
          900: '#101012', 
          800: '#27272A',
          400: '#A1A1AA',
        },
        black: {
          DEFAULT: '#020104', 
          void: '#000000'
        },
        lime: {
          neon: '#D4FF70',
          glow: '#BEF264',
          dim: '#4D7C0F',
        },
        cyan: {
          glow: '#22D3EE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'reveal': 'reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'border-spin': 'border-spin 4s linear infinite',
        'flow-line': 'flowLine 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        reveal: {
          '0%': { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'border-spin': {
          '100%': { transform: 'rotate(-360deg)' },
        },
        flowLine: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    }
  },
  plugins: [],
}
