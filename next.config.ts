import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias["@radix-ui/react-avatar"] = path.resolve(
      __dirname,
      "node_modules/@radix-ui/react-avatar/dist/index.js"
    );
    config.resolve.alias["next-themes"] = path.resolve(
      __dirname,
      "node_modules/next-themes/dist/index.js"
    );
    return config;
  },
};

export default nextConfig;
