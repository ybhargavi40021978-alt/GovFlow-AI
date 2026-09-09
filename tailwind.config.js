/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B192C',
            light: '#1E3E62',
            dark: '#060E18',
            surface: '#112238',
          },
          blue: {
            DEFAULT: '#0066CC',
            hover: '#0052A3',
            light: '#E6F0FA',
            subtle: '#F0F6FC',
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          saffron: {
            DEFAULT: '#EA580C',
            light: '#FFF7ED',
            dark: '#C2410C',
            50: '#fff7ed',
            100: '#ffedd5',
            500: '#f97316',
            600: '#ea580c',
          },
          green: {
            DEFAULT: '#15803D',
            light: '#F0FDF4',
            dark: '#166534',
            50: '#f0fdf4',
            100: '#dcfce7',
            600: '#16a34a',
            700: '#15803d',
          },
          neutral: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(11, 25, 44, 0.06), 0 1px 4px -1px rgba(11, 25, 44, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(11, 25, 44, 0.1), 0 4px 6px -2px rgba(11, 25, 44, 0.05)',
        'elevation': '0 20px 25px -5px rgba(11, 25, 44, 0.08), 0 10px 10px -5px rgba(11, 25, 44, 0.03)',
      },
    },
  },
  plugins: [],
}
