module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#FF8A80', // Soft coral
        secondary: '#A8E6CF', // Warm mint
        accent: '#E1BEE7', // Gentle lavender
        neutral: {
          50: '#F5F5F0', // Background
          700: '#8B8680', // Text
        },
        error: '#FFB3B3', // Soft red
      },
    },
  },
  plugins: [],
}; 