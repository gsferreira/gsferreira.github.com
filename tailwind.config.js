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
              backgroundColor: '#1f2937',
              color: '#e5e7eb',
            },
            code: {
              color: '#ef4444',
              '&::before': {
                content: '""',
              },
              '&::after': {
                content: '""',
              },
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