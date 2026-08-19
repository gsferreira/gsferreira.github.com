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
      // Editorial prose. Body sits at the sub-brand's 18px `card` step rather
      // than the parent's 16px Body: 16px across 140 long technical posts is a
      // real readability regression, and 18/28 is still a documented step.
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            // Set the variable, not a literal `color`. A literal here would win
            // over the invert block, which only redefines the variable, and
            // anything inheriting from the root (list items) would stay dark.
            '--tw-prose-body': '#484848', // Charcoal 80%, 8.33:1 on Off White
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
            h1: { color: '#1A1A1A', fontSize: '2.5rem',   lineHeight: '3rem',     letterSpacing: '-0.01em', fontWeight: '600' },
            h2: { color: '#1A1A1A', fontSize: '1.75rem',  lineHeight: '2.25rem',  fontWeight: '600', marginTop: '2em',   marginBottom: '0.75em' },
            h3: { color: '#1A1A1A', fontSize: '1.25rem',  lineHeight: '1.875rem', fontWeight: '600', marginTop: '1.6em', marginBottom: '0.5em' },
            h4: { color: '#1A1A1A', fontSize: '1.125rem', lineHeight: '1.75rem',  fontWeight: '600', marginTop: '1.4em', marginBottom: '0.5em' },
            p: { marginTop: '1.25em', marginBottom: '1.25em' },
            strong: { color: '#1A1A1A', fontWeight: '600' },
            // No accent colour exists on this site, so links carry their
            // meaning with an underline instead.
            a: {
              color: '#1A1A1A',
              fontWeight: '400',
              textDecoration: 'underline',
              textDecorationColor: '#757575',
              textDecorationThickness: '1px',
              textUnderlineOffset: '2px',
              '&:hover': { color: '#1A1A1A', textDecorationColor: '#1A1A1A' },
            },
            blockquote: {
              color: '#484848',
              fontWeight: '300',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              lineHeight: '1.875rem',
              borderLeftColor: '#D1D1D1',
              borderLeftWidth: '2px',
              quotes: 'none',
            },
            hr: { borderColor: '#D1D1D1' },
            'ul > li::marker': { color: '#757575' },
            'ol > li::marker': { color: '#757575' },
            thead: { borderBottomColor: '#A3A3A3' },
            'thead th': { color: '#1A1A1A' },
            'tbody tr': { borderBottomColor: '#D1D1D1' },
            figcaption: { color: '#484848', fontSize: '0.875rem', lineHeight: '1.25rem' },
            // Code is a raised surface: White on the Off White page, with a
            // Charcoal 20% hairline.
            pre: {
              backgroundColor: '#FFFFFF',
              color: '#1A1A1A',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #D1D1D1',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: '#1A1A1A',
              fontSize: '0.875em',
              fontWeight: '400',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },
            code: {
              color: '#1A1A1A',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D1D1',
              borderRadius: '4px',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              fontWeight: '400',
              fontSize: '0.875em',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': '#D1D1D1',
            '--tw-prose-headings': '#FFFFFF',
            '--tw-prose-links': '#FFFFFF',
            '--tw-prose-bold': '#FFFFFF',
            '--tw-prose-counters': '#A3A3A3',
            '--tw-prose-bullets': '#757575',
            '--tw-prose-hr': '#484848',
            '--tw-prose-quote-borders': '#484848',
            '--tw-prose-captions': '#A3A3A3',
            '--tw-prose-code': '#FFFFFF',
            '--tw-prose-pre-code': '#FFFFFF',
            '--tw-prose-pre-bg': '#484848',
            '--tw-prose-th-borders': '#757575',
            '--tw-prose-td-borders': '#484848',
            color: '#D1D1D1',
            'h1, h2, h3, h4, h5, h6': { color: '#FFFFFF' },
            p: { color: '#D1D1D1' },
            li: { color: '#D1D1D1' },
            strong: { color: '#FFFFFF' },
            a: {
              color: '#FFFFFF',
              textDecorationColor: '#A3A3A3',
              '&:hover': { color: '#FFFFFF', textDecorationColor: '#FFFFFF' },
            },
            blockquote: { color: '#D1D1D1', borderLeftColor: '#484848' },
            hr: { borderColor: '#484848' },
            pre: { backgroundColor: '#484848', color: '#FFFFFF', borderColor: '#484848' },
            'pre code': { color: '#FFFFFF' },
            code: { color: '#FFFFFF', backgroundColor: '#484848', borderColor: '#484848' },
            'ul > li::marker': { color: '#A3A3A3' },
            'ol > li::marker': { color: '#A3A3A3' },
            figcaption: { color: '#A3A3A3' },
            'thead th': { color: '#FFFFFF' },
            'tbody td': { color: '#D1D1D1' },
            'tbody tr': { borderBottomColor: '#484848' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 