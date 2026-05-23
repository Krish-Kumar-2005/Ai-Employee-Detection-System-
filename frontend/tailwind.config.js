/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        surface: {
          DEFAULT: '#0F172A',
          glass: 'rgba(15, 23, 42, 0.4)',
        },
        primary: {
          DEFAULT: '#6366F1',
          glow: 'rgba(99, 102, 241, 0.5)',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          crimson: '#991B1B',
        },
        textMain: '#F8FAFC',
        textSecondary: '#E2E8F0',
        textMuted: '#94A3B8'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-error': '0 0 20px rgba(244, 63, 94, 0.3)',
        surface: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { top: '0%', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { top: '100%', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
