/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html', // Scan HTML files in the templates directory
    './static/scripts.js', // Include JS file if it manipulates classes
  ],
  theme: {
    extend: {
      backgroundImage: {
        'iron-texture': "url('/static/images/iron-texture.jpg')",
        'concrete-texture': "url('/static/images/concrete-texture.jpg')",
        'glass-texture': "url('/static/images/glass-texture.jpg')",
        'wood-texture': "url('/static/images/wood-texture.jpg')",
      },
      fontFamily: {
        // Add the custom font if needed, matching the old CSS
        'fira-code': ['Fira Code', 'Consolas', 'Courier New', 'monospace'],
        'sans': ['ui-sans-serif', 'system-ui'], // Example: A generic sans-serif font
        'serif': ['ui-serif', 'Georgia'], // Example: A generic serif font
        'my-custom-font': ['"My Custom Font"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
