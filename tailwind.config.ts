import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === SIAGA POSKO Design Tokens ===
        'siaga': {
          'primary': '#00236f',          // Deep Navy Blue
          'primary-container': '#1e3a8a',
          'primary-fixed': '#dce1ff',
          'primary-fixed-dim': '#b6c4ff',
          'on-primary': '#ffffff',
          'on-primary-container': '#90a8ff',
          'on-primary-fixed': '#00164e',
          'on-primary-fixed-variant': '#264191',
          'inverse-primary': '#b6c4ff',
          
          'secondary': '#006a63',        // Rescue Teal
          'secondary-container': '#99efe5',
          'secondary-fixed': '#9cf2e8',
          'secondary-fixed-dim': '#80d5cb',
          'on-secondary': '#ffffff',
          'on-secondary-container': '#006f67',
          'on-secondary-fixed': '#00201d',
          'on-secondary-fixed-variant': '#00504a',
          
          'tertiary': '#5d0004',
          'tertiary-container': '#87000a',
          'tertiary-fixed': '#ffdad6',
          'tertiary-fixed-dim': '#ffb4ab',
          'on-tertiary': '#ffffff',
          'on-tertiary-container': '#ff8b80',
          'on-tertiary-fixed': '#410002',
          'on-tertiary-fixed-variant': '#93000b',
          
          'error': '#ba1a1a',
          'error-container': '#ffdad6',
          'on-error': '#ffffff',
          'on-error-container': '#93000a',
          
          'surface': '#f8f9ff',
          'surface-dim': '#cbdbf5',
          'surface-bright': '#f8f9ff',
          'surface-variant': '#d3e4fe',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#eff4ff',
          'surface-container': '#e5eeff',
          'surface-container-high': '#dce9ff',
          'surface-container-highest': '#d3e4fe',
          'surface-tint': '#4059aa',
          
          'on-surface': '#0b1c30',
          'on-surface-variant': '#444651',
          'on-background': '#0b1c30',
          'background': '#f8f9ff',
          
          'outline': '#757682',
          'outline-variant': '#c5c5d3',
          'inverse-surface': '#213145',
          'inverse-on-surface': '#eaf1ff',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-xl-mobile': ['26px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '700' }],
      },
      spacing: {
        'margin-mobile': '1rem',
        'margin-tablet': '1.5rem',
        'margin-desktop': '2rem',
        'gutter': '1rem',
        'gutter-mobile': '0.75rem',
        'gutter-desktop': '1.5rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        countUp: 'countUp 0.5s ease-out forwards',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0, 35, 111, 0.06), 0 2px 8px rgba(0, 35, 111, 0.04)',
        'card-elevated': '0 2px 8px rgba(0, 35, 111, 0.1), 0 4px 16px rgba(0, 35, 111, 0.06)',
        'nav': '0 -2px 12px rgba(0, 0, 0, 0.05)',
        'header': '0 1px 8px rgba(0, 0, 0, 0.04)',
        'toast': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
