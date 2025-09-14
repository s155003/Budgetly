/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
}

export default nextConfig
