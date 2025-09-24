/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Quantum Minimal Color System
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Main brand color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },

      // Clean Typography System
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // Minimal Shadow System (only for true elevation)
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        // Clean focus shadow
        'focus': '0 0 0 3px rgb(59 130 246 / 0.2)',
      },

      // Performance-First Animations
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale': 'scale 0.15s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // Clean Spacing System
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents, theme }) {
      // Quantum Minimal Utilities
      const utilities = {
        // Clean surface system (replaces glass morphism)
        '.surface': {
          backgroundColor: 'rgb(255 255 255)',
          border: '1px solid rgb(229 231 235)',
          borderRadius: theme('borderRadius.lg'),
        },
        '.surface-raised': {
          backgroundColor: 'rgb(255 255 255)',
          border: '1px solid rgb(229 231 235)',
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.sm'),
        },
        '.surface-interactive': {
          backgroundColor: 'rgb(255 255 255)',
          border: '1px solid rgb(229 231 235)',
          borderRadius: theme('borderRadius.lg'),
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: 'rgb(209 213 219)',
            boxShadow: theme('boxShadow.sm'),
          },
        },

        // Clean button system
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px', // Touch-optimized
          padding: '0.75rem 1.5rem',
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.lg'),
          transition: 'all 0.15s ease',
          cursor: 'pointer',
          border: '1px solid transparent',
          '&:focus': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus'),
          },
        },

        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: 'rgb(255 255 255)',
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary.700'),
          },
        },

        '.btn-secondary': {
          backgroundColor: 'rgb(255 255 255)',
          color: theme('colors.gray.700'),
          borderColor: theme('colors.gray.300'),
          '&:hover': {
            backgroundColor: theme('colors.gray.50'),
            borderColor: theme('colors.gray.400'),
          },
        },

        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.gray.600'),
          '&:hover': {
            backgroundColor: theme('colors.gray.100'),
            color: theme('colors.gray.700'),
          },
        },

        // Clean input system
        '.input': {
          display: 'block',
          width: '100%',
          minHeight: '44px',
          padding: '0.75rem 1rem',
          fontSize: theme('fontSize.sm')[0],
          backgroundColor: 'rgb(255 255 255)',
          border: '1px solid rgb(209 213 219)',
          borderRadius: theme('borderRadius.lg'),
          transition: 'border-color 0.15s ease',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: theme('boxShadow.focus'),
          },
          '&::placeholder': {
            color: theme('colors.gray.400'),
          },
        },

        // Performance optimizations
        '.gpu-optimized': {
          transform: 'translateZ(0)',
          willChange: 'transform',
        },

        // Clean scrollbar
        '.clean-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.gray.300'),
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme('colors.gray.400'),
            },
          },
        },
      }

      addUtilities(utilities)
    }
  ],
}