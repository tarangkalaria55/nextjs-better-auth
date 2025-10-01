import type { NextConfig } from "next";

import "./src/env/envConfig";

const nextConfig: NextConfig = {
  output: "standalone",
  // Add the packages in transpilePackages
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core", "@next/env"],
};

export default nextConfig;
