module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.liquid',
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.css',
    './src/**/*.njk',
    './src/**/*.md',
  ],
  theme: {
    extend: {
      // ---------------------------------------------------------------
      // Black Lab Studios design tokens (V3) as applied to the
      // Gui Ferreira sub-brand: foundation colours only, no accent.
      // ---------------------------------------------------------------
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Brand black is Charcoal, not #000000. Overriding `black` migrates
        // every bg-black / text-black / dark:bg-black and all their opacity
        // variants without touching a template.
        black: '#1A1A1A',
        // `white` stays #FFFFFF. It is the brand's raised light surface.

        charcoal: {
          DEFAULT: '#1A1A1A', // text primary on light, page surface on dark
          80: '#484848',      // text secondary on light, raised surface on dark
          60: '#757575',      // large text and headings only (4.20:1 on Off White)
          40: '#A3A3A3',      // decorative; as text only on the dark page base
          20: '#D1D1D1',      // rules, borders; text secondary on dark
        },
        offwhite: '#F6F4F1',  // light page surface

        // Safety net. Tailwind's default gray is blue-cast, and
        // theme.extend.colors.gray deep-merges per shade, so every shade has
        // to be listed or the omitted ones stay cool. Exact brand values sit
        // on 200/400/500/700/900; the rest are neutral interpolations.
        gray: {
          50: '#F6F4F1',  // Off White
          100: '#EDEBE7',
          200: '#D1D1D1', // Charcoal 20%
          300: '#BDBDBD',
          400: '#A3A3A3', // Charcoal 40%
          500: '#757575', // Charcoal 60%. Below AA on Off White by design; see notes.
          600: '#5E5E5E',
          700: '#484848', // Charcoal 80%
          800: '#333333',
          900: '#1A1A1A', // Charcoal 100%
          950: '#1A1A1A',
        },
      },
      // Brand type scale. Each tuple carries its own weight, so `text-h1`
      // needs no `font-semibold` beside it.
      fontSize: {
        'h1':      ['3.5rem',   { lineHeight: '4rem',     letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2':      ['2.5rem',   { lineHeight: '3rem',     letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':      ['1.75rem',  { lineHeight: '2.25rem',  letterSpacing: '0',       fontWeight: '600' }],
        'body':    ['1rem',     { lineHeight: '1.75rem',  fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.25rem',  fontWeight: '400' }],
        'accent':  ['1rem',     { lineHeight: '1.75rem',  fontWeight: '300' }], // pair with `italic`
        // Interface steps. Sub-brand extension: the parent scale jumps from
        // H3 28px straight to Body 16px, which is a marketing scale.
        'eyebrow': ['0.75rem',  { lineHeight: '1.125rem', letterSpacing: '0.06em', fontWeight: '600' }],
        'meta':    ['0.875rem', { lineHeight: '1.25rem',  fontWeight: '400' }],
        'card':    ['1.125rem', { lineHeight: '1.75rem',  fontWeight: '600' }],
        'lead':    ['1.25rem',  { lineHeight: '1.875rem', fontWeight: '400' }],
      },
      // Sub-brand extension. `card` is the same 16px as Tailwind's
      // `rounded-2xl`; prefer `rounded-card` in new code.
      borderRadius: {
        'chip': '4px',
        'card': '16px',
        'pill': '9999px',
      },
      typography: {
        DEFAULT: {
          css: {
            'max-width': 'none',
            color: '#374151',
            h2: {
              color: '#111827',
              fontWeight: '600',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              color: '#2563eb',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            pre: {
              backgroundColor: '#f8fafc',
              color: '#334155',
              padding: '1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: '#334155',
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
              color: '#4b5563',
              backgroundColor: '#f3f4f6',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
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
            // Syntax highlighting colors
            '.hljs-keyword': {
              color: '#8b5cf6', // Purple for keywords
            },
            '.hljs-string': {
              color: '#059669', // Green for strings
            },
            '.hljs-comment': {
              color: '#6b7280', // Gray for comments
            },
            '.hljs-type': {
              color: '#2563eb', // Blue for types
            },
            '.hljs-number': {
              color: '#db2777', // Pink for numbers
            },
            '.hljs-function': {
              color: '#4b5563', // Gray for functions
            },
            '.hljs-title': {
              color: '#4b5563', // Gray for titles
            },
            '.hljs-params': {
              color: '#4b5563', // Gray for parameters
            },
          },
        },
        // Add dark mode styles
        'invert': {
          css: {
            '--tw-prose-body': '#e5e7eb',
            '--tw-prose-headings': '#f3f4f6',
            '--tw-prose-links': '#60a5fa',
            '--tw-prose-links-hover': '#93c5fd',
            '--tw-prose-underline': '#60a5fa',
            '--tw-prose-underline-hover': '#93c5fd',
            '--tw-prose-bold': '#f3f4f6',
            '--tw-prose-counters': '#9ca3af',
            '--tw-prose-bullets': '#e5e7eb',
            '--tw-prose-hr': '#374151',
            '--tw-prose-quote-borders': '#374151',
            '--tw-prose-captions': '#9ca3af',
            '--tw-prose-code': '#f3f4f6',
            '--tw-prose-code-bg': '#1a1e2d',
            '--tw-prose-pre-code': '#e5e7eb',
            '--tw-prose-pre-bg': '#1a1e2d',
            '--tw-prose-pre-border': '#2d3748',
            '--tw-prose-th-borders': '#4a5568',
            '--tw-prose-td-borders': '#2d3748',

            // Override nested elements
            'h1, h2, h3, h4, h5, h6': {
              color: '#f3f4f6',
            },
            p: {
              color: '#e5e7eb',
            },
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            strong: {
              color: '#f3f4f6',
            },
            code: {
              color: '#f3f4f6',
              backgroundColor: '#1a1e2d',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            figcaption: {
              color: '#9ca3af',
            },
            blockquote: {
              color: '#e5e7eb',
            },
            'ul > li::marker': {
              color: '#e5e7eb',
            },
            'ol > li::marker': {
              color: '#e5e7eb',
            },
            'thead th': {
              color: '#f3f4f6',
            },
            'tbody td': {
              color: '#e5e7eb',
            },
            'tbody tr': {
              borderBottomColor: '#2d3748',
            },
            'thead': {
              borderBottomColor: '#4a5568',
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