/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#534AB7', light: '#EEEDFE', mid: '#AFA9EC' },
        finance: {
          green: '#0F6E56', 'green-light': '#E1F5EE',
          red: '#993C1D', 'red-light': '#FAECE7',
          amber: '#854F0B', 'amber-light': '#FAEEDA',
        },
        bg: { DEFAULT: '#F8F8FB', card: '#FFFFFF', secondary: '#F0EFF8' },
        border: '#E4E2F0',
        text: { DEFAULT: '#1A1730', muted: '#6B6882' }
      },
      borderRadius: { DEFAULT: '10px', sm: '6px', lg: '14px' },
      fontFamily: { sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'] }
    }
  },
  plugins: []
}
