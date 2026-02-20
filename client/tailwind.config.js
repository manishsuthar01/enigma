/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0F172A',
                    light: '#1E293B',
                },
                softwhite: '#F8FAFC',
                slate: '#334155',
                muted: '#64748B',
                risk: {
                    high: '#DC2626',
                    medium: '#F59E0B',
                    low: '#16A34A',
                },
                border: '#E2E8F0',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
