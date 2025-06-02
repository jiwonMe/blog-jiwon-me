/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // Enable experimental features for better caching
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic pages
      static: 180, // 3 minutes for static pages
    },
  },
  async headers() {
    return [
      // API 라우트 캐싱
      {
        source: '/api/blog',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1800, stale-while-revalidate=3600',
          },
        ],
      },
      // 정적 자산 캐싱
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // 이미지 프록시 캐싱
      {
        source: '/api/image-proxy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, immutable', // 1년 캐싱
          },
        ],
      },
    ];
  },
};

export default nextConfig;
