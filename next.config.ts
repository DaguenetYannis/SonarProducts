import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { dirs: ["app", "components", "domain", "infrastructure", "lib", "scripts", "tests"] }
};

export default nextConfig;
