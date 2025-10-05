import "./src/env/envConfig";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  // Add the packages in transpilePackages
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core", "@next/env"],
};

export default nextConfig;
