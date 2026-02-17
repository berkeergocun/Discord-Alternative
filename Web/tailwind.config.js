/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Discord Brand Colors
        blurple: {
          DEFAULT: '#5865F2',
          dark: '#4752C4',
          light: '#7289DA',
        },
        // Background colors
        'bg-primary': '#313338',
        'bg-secondary': '#2B2D31',
        'bg-tertiary': '#1E1F22',
        'bg-chat': '#313338',
        'bg-floating': '#111214',
        // Text colors
        'text-primary': '#F2F3F5',
        'text-secondary': '#B5BAC1',
        'text-muted': '#80848E',
        'text-link': '#00AFF4',
        'link': '#00AFF4',
        // Status colors
        'status-online': '#23A559',
        'status-idle': '#F0B232',
        'status-dnd': '#F23F43',
        'status-offline': '#80848E',
        // Accent colors
        'accent-red': '#DA373C',
        'accent-green': '#248046',
        'accent-yellow': '#FEE75C',
      },
      fontFamily: {
        sans: ['gg sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'discord': '8px',
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'in': 'in 0.2s ease-out',
        'out': 'out 0.2s ease-in',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        in: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        out: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        }
      }
    },
  },
  plugins: [],
}
