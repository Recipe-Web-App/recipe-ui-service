import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        'input-hover': 'hsl(var(--input-hover))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.2s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
        'slide-out-to-top': 'slide-out-to-top 0.2s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.2s ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 0.2s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.2s ease-out',
        'slide-out-to-right': 'slide-out-to-right 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'zoom-out': 'zoom-out 0.2s ease-out',
        'skeleton-wave': 'skeleton-wave 2s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-in-from-left': {
          from: {
            transform: 'translateX(-50%) translateY(-48%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: '1',
          },
        },
        'slide-out-to-left': {
          from: {
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(-50%) translateY(-48%)',
            opacity: '0',
          },
        },
        'slide-in-from-top': {
          from: {
            transform: 'translateX(-50%) translateY(-48%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: '1',
          },
        },
        'slide-out-to-top': {
          from: {
            transform: 'translateX(-50%) translateY(-50%)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(-50%) translateY(-48%)',
            opacity: '0',
          },
        },
        'slide-in-from-bottom': {
          from: {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'slide-out-to-bottom': {
          from: {
            transform: 'translateY(0)',
            opacity: '1',
          },
          to: {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        'slide-in-from-right': {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'slide-out-to-right': {
          from: {
            transform: 'translateX(0)',
            opacity: '1',
          },
          to: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'zoom-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'zoom-out': {
          from: {
            opacity: '1',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
        },
        'skeleton-wave': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      fontSize: {
        'button-sm': [
          '0.875rem',
          { lineHeight: '1.25rem', letterSpacing: '-0.025em' },
        ],
        'button-base': [
          '1rem',
          { lineHeight: '1.25rem', letterSpacing: '-0.025em' },
        ],
        'button-lg': [
          '1.125rem',
          { lineHeight: '1.25rem', letterSpacing: '-0.025em' },
        ],
        'input-sm': [
          '0.875rem',
          { lineHeight: '1.25rem', letterSpacing: '0em' },
        ],
        'input-base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
        'input-lg': [
          '1.125rem',
          { lineHeight: '1.75rem', letterSpacing: '0em' },
        ],
        'label-sm': [
          '0.75rem',
          { lineHeight: '1rem', letterSpacing: '0.025em', fontWeight: '500' },
        ],
        'label-base': [
          '0.875rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '0.025em',
            fontWeight: '500',
          },
        ],
        'label-lg': [
          '1rem',
          { lineHeight: '1.5rem', letterSpacing: '0.025em', fontWeight: '500' },
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config;
