import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5153",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5153",
        pathname: "/**",
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/collection",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/collections",
        destination: "/brands",
        permanent: true,
      },
      {
        source: "/collection/:slug",
        destination: "/brands/:slug",
        permanent: true,
      },
      {
        source: "/collections/:slug",
        destination: "/brands/:slug",
        permanent: true,
      },
      {
        source: "/brands/coco-joy",
        destination: "/brands/cocojoy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
