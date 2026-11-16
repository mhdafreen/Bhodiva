/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        accent: {
          blue: '#0284c7',
          mint: '#e6fffa',
          dark: '#0f172a',
          charcoal: '#1e293b',
          muted: '#64748b',
          lightBg: '#f8fafc',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Noto Sans Malayalam"',
          '"Noto Sans Devanagari"',
          '"Noto Sans Tamil"',
          '"Noto Sans Telugu"',
          '"Noto Sans Kannada"'
        ]
      }
    },
  },
  plugins: [],
}
