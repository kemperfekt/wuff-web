module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {

        colors: {
          primary: '#4B7893',
          accent: '#C45C2E',
          background: '#F7E5C9',
          secondary: '#CD8E3A',
          highlight: '#B86C26',
        },
      
        fontFamily: {
          sans: ['Figtree', 'sans-serif'],
        },
        keyframes: {
          livelyBounce: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-8px)' },
          },
        },
        animation: {
          livelyBounce: 'livelyBounce 0.9s infinite ease-in-out',
        },
      },
    },
    plugins: [],
  }