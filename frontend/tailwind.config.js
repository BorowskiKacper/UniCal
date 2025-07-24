/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [plugin(function({ addUtilities }) {
        addUtilities({
          '.scrollbar-overlay': {
            // For Webkit browsers (Chrome, Safari)
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent', // Makes the track invisible
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(156, 163, 175, 0.5)', // A semi-transparent gray
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.7)', // Darker on hover
              },
            },
            // For Firefox
            'scrollbarWidth': 'thin',
            'scrollbarColor': 'rgba(156, 163, 175, 0.5) transparent',
          },
        })
      })
    ],
  }