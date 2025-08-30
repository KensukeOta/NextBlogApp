import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**", // 例: /user-avatars/users/... を許可
      },
    ],
  },
};

export default nextConfig;
