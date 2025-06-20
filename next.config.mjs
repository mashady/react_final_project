/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
  images: {
    domains: ["localhost", "127.0.0.1", "your-production-domain.com"],
  },
};

export default nextConfig;
