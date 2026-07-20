const { withFaust, getWpHostname } = require('@faustwp/core');

module.exports = withFaust({
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['node_modules'],
  },
  images: {
    domains: [
      getWpHostname(),
      'cms.grad.calpoly.edu',
    ],
    // Prefer modern formats where supported
    formats: ['image/avif', 'image/webp'],

    // Fine-tune the generated widths so Next doesn’t overshoot as much
    deviceSizes: [360, 480, 640, 768, 1024, 1280], // responsive layouts
    imageSizes: [160, 240, 320, 340, 420],         // fixed/card/avatar sizes

    // Long-lived cache for optimized images
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },



  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
});
