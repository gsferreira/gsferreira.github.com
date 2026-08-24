/**
 * Black Lab Studios design system, Gui Ferreira sub-brand.
 *
 * Foundation colours only. Rock, Meadow Mist, Warm Clay, Lavender and Pampas
 * all stay out: this is the one surface in the system that runs neutral.
 * Charcoal #1A1A1A, not #000000. Off White #F6F4F1, not #FFFFFF.
 *
 * Spec: Brand/Sub-brands/Gui Ferreira.md
 */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.liquid',
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.css',
    './src/**/*.njk',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Charcoal, the brand's black.
        black: '#1A1A1A',
        // Off White, the light page ground.
        surface: '#F6F4F1',
        // The Charcoal ladder, with tween steps where Tailwind needs more
        // stops than the five the brand defines.
        gray: {
          50: '#FFFFFF',   // raised surface, bands lift off the off-white page
          100: '#EDEAE5',  // warm hover
          200: '#DEDCD9',  // light hairline
          300: '#D1D1D1',  // Charcoal 20, dark-mode body text and rules
          400: '#A3A3A3',  // Charcoal 40, dark-mode muted
          500: '#666666',  // Charcoal 60 nudged to clear AA on page and sunken alike
          600: '#484848',  // Charcoal 80, light-mode secondary text
          700: '#3A3A3A',
          800: '#2E2E2E',
          900: '#242424',  // dark-mode raised card surface
          950: '#1A1A1A',  // Charcoal
        },
      },
      borderRadius: {
        DEFAULT: '4px',
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
        'xl': '8px',
        '2xl': '8px',
        '3xl': '8px',
        'full': '9999px', // buttons and tags keep the pill
      },
      typography: {
        DEFAULT: {
          css: {
            'max-width': 'none',
            // Drive every prose colour from the foundation. Without these the
            // plugin keeps its stock cool greys on h1, h4, quotes and rules.
            '--tw-prose-body': '#484848',
            '--tw-prose-headings': '#1A1A1A',
            '--tw-prose-lead': '#484848',
            '--tw-prose-links': '#1A1A1A',
            '--tw-prose-bold': '#1A1A1A',
            '--tw-prose-counters': '#6B6B6B',
            '--tw-prose-bullets': '#A3A3A3',
            '--tw-prose-hr': '#D1D1D1',
            '--tw-prose-quotes': '#1A1A1A',
            '--tw-prose-quote-borders': '#D1D1D1',
            '--tw-prose-captions': '#6B6B6B',
            '--tw-prose-kbd': '#1A1A1A',
            '--tw-prose-code': '#1A1A1A',
            '--tw-prose-pre-code': '#484848',
            '--tw-prose-pre-bg': '#EDEAE5',
            '--tw-prose-th-borders': '#D1D1D1',
            '--tw-prose-td-borders': '#DEDCD9',
            color: '#484848',
            h2: {
              color: '#1A1A1A',
              fontWeight: '600',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              color: '#1A1A1A',
              fontWeight: '600',
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            // With no accent in the palette, colour cannot carry link meaning.
            // The underline does the work.
            a: {
              color: '#1A1A1A',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              '&:hover': {
                color: '#484848',
              },
            },
            pre: {
              backgroundColor: '#EDEAE5',
              color: '#484848',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid #D1D1D1',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: '#484848',
              fontSize: '0.875em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              '&::before': {
                content: 'none',
              },
              '&::after': {
                content: 'none',
              },
            },
            code: {
              color: '#484848',
              backgroundColor: '#EDEAE5',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '2px',
              fontWeight: '400',
              fontSize: '0.875em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              '&::before': {
                content: '""',
              },
              '&::after': {
                content: '""',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        // Dark mode prose. Charcoal base, White text, Charcoal 20 for body.
        'invert': {
          css: {
            '--tw-prose-body': '#D1D1D1',
            '--tw-prose-headings': '#FFFFFF',
            '--tw-prose-lead': '#D1D1D1',
            '--tw-prose-links': '#FFFFFF',
            '--tw-prose-quotes': '#FFFFFF',
            '--tw-prose-bold': '#FFFFFF',
            '--tw-prose-counters': '#A3A3A3',
            '--tw-prose-bullets': '#D1D1D1',
            '--tw-prose-hr': '#3A3A3A',
            '--tw-prose-quote-borders': '#3A3A3A',
            '--tw-prose-captions': '#A3A3A3',
            '--tw-prose-code': '#FFFFFF',
            '--tw-prose-pre-code': '#D1D1D1',
            '--tw-prose-pre-bg': '#242424',
            '--tw-prose-th-borders': '#484848',
            '--tw-prose-td-borders': '#3A3A3A',

            // Override nested elements
            'h1, h2, h3, h4, h5, h6': {
              color: '#FFFFFF',
            },
            p: {
              color: '#D1D1D1',
            },
            a: {
              color: '#FFFFFF',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              '&:hover': {
                color: '#D1D1D1',
              },
            },
            strong: {
              color: '#FFFFFF',
            },
            code: {
              color: '#FFFFFF',
              backgroundColor: '#242424',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            figcaption: {
              color: '#A3A3A3',
            },
            blockquote: {
              color: '#D1D1D1',
            },
            'ul > li::marker': {
              color: '#D1D1D1',
            },
            'ol > li::marker': {
              color: '#D1D1D1',
            },
            'thead th': {
              color: '#FFFFFF',
            },
            'tbody td': {
              color: '#D1D1D1',
            },
            'tbody tr': {
              borderBottomColor: '#3A3A3A',
            },
            'thead': {
              borderBottomColor: '#484848',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
