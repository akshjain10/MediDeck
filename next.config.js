/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'img.icons8.com'],
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/share/:id',
        destination: '/api/share/:id'
      }
    ];
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;