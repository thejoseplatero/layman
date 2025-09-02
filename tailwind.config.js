/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0D10',
          paper: 'rgba(18, 20, 24, 0.6)',
        },
        primary: {
          main: '#5EE1A9',
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#5EE1A9',
          600: '#4ACD94',
          700: '#3BAA7A',
        },
        secondary: {
          main: '#8AB4F8',
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#8AB4F8',
          600: '#6B9EF7',
          700: '#4C88F6',
        },
        glass: {
          surface: 'rgba(22, 24, 28, 0.55)',
          border: 'rgba(255, 255, 255, 0.10)',
          divider: 'rgba(255, 255, 255, 0.08)',
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.92)',
          secondary: 'rgba(255, 255, 255, 0.64)',
          disabled: 'rgba(255, 255, 255, 0.38)',
        },
        // Light theme overrides
        light: {
          background: {
            DEFAULT: '#FEFEFE',
            paper: 'rgba(255, 255, 255, 0.8)',
          },
          glass: {
            surface: 'rgba(255, 255, 255, 0.65)',
            border: 'rgba(0, 0, 0, 0.08)',
            divider: 'rgba(0, 0, 0, 0.06)',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.60)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'lg': '14px',
        'xl': '16px',
        '2xl': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        'glass': '12px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'assistant-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
      },
      animation: {
        'fade-in': 'fadeIn 120ms ease-out',
        'slide-up': 'slideUp 120ms ease-out',
        'hover-lift': 'hoverLift 120ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-1px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'focus-ring': '0 0 0 2px rgba(94, 225, 169, 0.9)',
      },
    },
  },
  plugins: [],
}
