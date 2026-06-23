/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        amber: {
          500: '#FF6B00',
          100: '#FFF3E0',
        },
        navy: {
          900: '#1A1A2E',
        },
        slate: {
          700: '#2D3748',
        },
        muted: {
          DEFAULT: '#718096',
        },
        surface: {
          50: '#F7F8FA',
        },
        success: {
          500: '#38A169',
        },
        alert: {
          500: '#E53E3E',
        },
        info: {
          500: '#3B82F6',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        display: ['32px', '40px'],
        h1: ['24px', '32px'],
        h2: ['18px', '24px'],
        h3: ['15px', '20px'],
        body: ['14px', '20px'],
        label: ['12px', '16px'],
        caption: ['11px', '14px'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
