/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Local backend (uploaded images served from MongoDB via /api/images/:id)
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "http", hostname: "127.0.0.1", port: "5000" },
      // Deployed backend over https (any host) — safe for image display
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
