/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: '#050505',
                surface: '#111111',
                edge: '#222222',
                silver: '#999999',
                accent: '#1539',
                risk: {
                    high: '#ef4444',
                    medium: '#f59e0b',
                    low: '#22c55e',
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
            maxWidth: {
                container: '1100px',
            },
        },
    },
    plugins: [],
}
