import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [

      // Clerk avatar CDN

      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },

      // User-uploaded avatars served from our own storage
      
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },



  // Strict mode for catching bugs early


  reactStrictMode: true,

  // Forward API calls to Express in dev (optional — can also use NEXT_PUBLIC_API_URL)

  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/v1/:path*",
            destination: "http://localhost:4000/api/:path*",
          },
        ]
      : [];
  },
};

export default nextConfig;


