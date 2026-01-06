/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable manual dark mode
    theme: {
        extend: {
            colors: {
                'paw-pink': {
                    DEFAULT: '#F48FB1',
                    light: '#F8BBD0',
                    dark: '#F06292',
                },
                'paw-blue': {
                    DEFAULT: '#4DD0E1',
                    light: '#80DEEA',
                    dark: '#26C6DA',
                },
                'warm-cream': '#FFF9C4',
                'soft-white': '#FAFAFA',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            fontFamily: {
                'sans': ['Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
