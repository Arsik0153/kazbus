/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/main',
                destination: '/bus/main',
                permanent: true,
            },
            {
                source: '/main/:path*',
                destination: '/bus/main/:path*',
                permanent: true,
            },
            {
                source: '/directions',
                destination: '/bus/directions',
                permanent: true,
            },
            {
                source: '/directions/:path*',
                destination: '/bus/directions/:path*',
                permanent: true,
            },
            {
                source: '/my-tickets',
                destination: '/bus/my-tickets',
                permanent: true,
            },
            {
                source: '/my-tickets/:path*',
                destination: '/bus/my-tickets/:path*',
                permanent: true,
            },
            {
                source: '/profile',
                destination: '/bus/profile',
                permanent: true,
            },
            {
                source: '/profile/:path*',
                destination: '/bus/profile/:path*',
                permanent: true,
            },
            {
                source: '/refund',
                destination: '/bus/refund',
                permanent: true,
            },
            {
                source: '/refund/:path*',
                destination: '/bus/refund/:path*',
                permanent: true,
            },
            {
                source: '/buying',
                destination: '/bus/buying',
                permanent: true,
            },
            {
                source: '/buying/:path*',
                destination: '/bus/buying/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
