// next.config.mjs
export default {
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    async redirects() {
        return [
            {
                source: '/',
                destination: '/live-events',
                permanent: true,
            },
        ];
    },
    webpack(config) {
        return config;
    },
};
