import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            xs: '376px',
            ...defaultTheme.screens,
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                pulsate: {
                    '0%': { transform: 'scale(0.1)', opacity: '0' },
                    '50%': { transform: 'scale(1)', opacity: '0.5' },
                    '100%': { transform: 'scale(1.5)', opacity: '0' },
                },
            },
            animation: {
                pulsate: 'pulsate 1s ease-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;
