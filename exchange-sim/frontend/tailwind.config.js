export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                'bg-0': 'var(--color-bg-0)',
                'bg-1': 'var(--color-bg-1)',
                'bg-2': 'var(--color-bg-2)',
                'bg-3': 'var(--color-bg-3)',
                surface: 'var(--color-surface)',
                'surface-hover': 'var(--color-surface-hover)',

                // Borders
                'border-0': 'var(--color-border-0)',
                'border-1': 'var(--color-border-1)',
                'border-subtle': 'var(--color-border-subtle)',
                'border-focus': 'var(--color-border-focus)',

                // Text
                'text-0': 'var(--color-text-0)',
                'text-1': 'var(--color-text-1)',
                'text-2': 'var(--color-text-2)',
                'text-3': 'var(--color-text-3)',
                'text-inverse': 'var(--color-text-inverse)',

                // Brand/Primary
                primary: 'var(--color-primary)',
                'primary-hover': 'var(--color-primary-hover)',
                'primary-dark': 'var(--color-primary-dark)',
                'primary-soft': 'var(--color-primary-soft)',

                // Trading Colors
                buy: 'var(--color-buy)',
                sell: 'var(--color-sell)',
                'buy-hover': 'var(--color-buy-hover)',
                'sell-hover': 'var(--color-sell-hover)',
                'buy-soft': 'var(--color-buy-soft)',
                'sell-soft': 'var(--color-sell-soft)',

                // Status
                success: 'var(--color-success)',
                error: 'var(--color-error)',
                warning: 'var(--color-warning)',
                info: 'var(--color-info)',

                // Legacy mappings for compatibility
                background: 'var(--color-bg-0)',
                panel: 'var(--color-bg-2)',
                border: 'var(--color-border-0)',
                text: 'var(--color-text-0)',
                muted: 'var(--color-text-1)',
                green: 'var(--color-buy)',
                red: 'var(--color-sell)',
            },
            fontFamily: {
                mono: 'var(--font-mono)',
                sans: 'var(--font-sans)',
            },
            fontSize: {
                xs: 'var(--text-xs)',
                sm: 'var(--text-sm)',
                base: 'var(--text-base)',
                lg: 'var(--text-lg)',
                xl: 'var(--text-xl)',
                '2xl': 'var(--text-2xl)',
                '3xl': 'var(--text-3xl)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                full: 'var(--radius-full)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                panel: 'var(--shadow-panel)',
                'glow-primary': 'var(--shadow-glow-primary)',
                'glow-buy': 'var(--shadow-glow-buy)',
                'glow-sell': 'var(--shadow-glow-sell)',
            },
            transitionTimingFunction: {
                DEFAULT: 'var(--ease-default)',
                in: 'var(--ease-in)',
                out: 'var(--ease-out)',
                bounce: 'var(--ease-bounce)',
            },
            transitionDuration: {
                fast: 'var(--duration-fast)',
                DEFAULT: 'var(--duration-normal)',
                normal: 'var(--duration-normal)',
                slow: 'var(--duration-slow)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
