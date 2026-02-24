/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#0b0b0f",
                "background-light": "#f7f7f7",
                "background-dark": "#0b0b0f",
                "accent-gold": "#D4AF37",
                "accent-purple": "#A855F7",
                "gold-glow": "#D4AF37",
                "gold-bright": "#FFD700",
                "glass": "rgba(255, 255, 255, 0.03)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
