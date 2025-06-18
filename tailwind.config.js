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
      }
    },
  },
  plugins: [],
}; 