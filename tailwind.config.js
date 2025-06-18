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
      colors: {
        'dark-blue': '#121722',
        'dark-blue-hover': '#1D252F',
        'light-hover': '#F8F9FB',
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
            '--tw-prose-bullets': '#4b5563',
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
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 