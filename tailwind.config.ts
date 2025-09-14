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
