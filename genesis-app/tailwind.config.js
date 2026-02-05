/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Genesis Era Colors
        phosphor: {
          green: '#33FF00',
          amber: '#FFB000',
        },
        crt: {
          black: '#050505',
          dark: '#0C0C0C',
        },
        // Windows 95
        win95: {
          gray: '#C0C0C0',
          highlight: '#FFFFFF',
          shadow: '#808080',
          dark: '#404040',
          title: '#000080',
          titleInactive: '#808080',
        },
        // Web 1.0
        web1: {
          link: '#0000FF',
          visited: '#800080',
          bg: '#CCCCCC',
        },
        // Web 2.0
        web2: {
          gradientStart: '#4A90E2',
          gradientEnd: '#357ABD',
        },
        // Modern
        modern: {
          dark: '#0D0D0D',
          darker: '#1A1A1A',
          glass: 'rgba(255,255,255,0.1)',
        },
        // AGI Era
        agi: {
          cyan: '#00FFFF',
          purple: '#9D4EDD',
          gold: '#FFD700',
          deep: '#000000',
        },
      },
      fontFamily: {
        mono: ['VT323', 'Courier New', 'monospace'],
        terminal: ['IBM Plex Mono', 'monospace'],
        pixel: ['Press Start 2P', 'cursive'],
        system: ['MS Sans Serif', 'Tahoma', 'sans-serif'],
        web1: ['Times New Roman', 'serif'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'binary-rain': 'binaryRain 3s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        binaryRain: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
