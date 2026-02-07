export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // CryptoEx Theme (Mapped to tokens.css)
                background: "var(--color-bg-0)",
                panel: "var(--color-bg-2)",
                surface: "var(--color-bg-3)",
                surfaceHover: "var(--color-bg-3)", // fallback/same
                border: "var(--color-border-0)",
                borderLight: "var(--color-border-1)",

                // Primary Colors
                primary: "var(--color-primary)",
                primaryDark: "var(--color-primary-hover)",
                primaryLight: "var(--color-primary-soft)", // utilizing soft as light variant

                // Status Colors
                green: "var(--color-trade-buy)",
                greenDark: "var(--color-trade-buy-hover)",
                greenLight: "var(--color-trade-buy-soft)",
                red: "var(--color-trade-sell)",
                redDark: "var(--color-trade-sell-hover)",
                redLight: "var(--color-trade-sell-soft)",

                blue: "#3742fa", // Keep or map if added to tokens
                yellow: "#ffa502",

                // Text Colors
                muted: "var(--color-text-1)",
                mutedLight: "var(--color-text-2)",
                text: "var(--color-text-0)",
                textDim: "var(--color-text-2)",
                textInverse: "var(--color-text-inverse)",
            },
            fontFamily: {
                mono: ["JetBrains Mono", "monospace"],
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(0, 212, 170, 0.4)',
                'glow-green': '0 0 20px rgba(0, 212, 170, 0.4)',
                'glow-red': '0 0 20px rgba(255, 71, 87, 0.4)',
                'card': '0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #00d4aa 0%, #1de9b6 100%)',
                'gradient-green': 'linear-gradient(135deg, #00d4aa 0%, #1de9b6 100%)',
                'gradient-red': 'linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'slide-left': 'slideLeft 0.5s ease-out',
                'slide-right': 'slideRight 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
                'shimmer': 'shimmer 2s infinite',
                'glow': 'glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'price-up': 'priceUp 0.5s ease-out',
                'price-down': 'priceDown 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 170, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 212, 170, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                priceUp: {
                    '0%': { backgroundColor: 'rgba(0, 212, 170, 0)' },
                    '50%': { backgroundColor: 'rgba(0, 212, 170, 0.3)' },
                    '100%': { backgroundColor: 'rgba(0, 212, 170, 0)' },
                },
                priceDown: {
                    '0%': { backgroundColor: 'rgba(255, 71, 87, 0)' },
                    '50%': { backgroundColor: 'rgba(255, 71, 87, 0.3)' },
                    '100%': { backgroundColor: 'rgba(255, 71, 87, 0)' },
                },
            },
        },
    },
    plugins: [],
}
