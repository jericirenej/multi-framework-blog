import type { NextConfig } from "next";
import { type Configuration } from "webpack";
import {
  modifyConfigurationForSvgr,
  turboPackRulesetSVGR,
} from "./src/svgr.config";
const nextConfig: NextConfig = {
  webpack(config: Configuration) {
    return modifyConfigurationForSvgr(config);
  },
  turbopack: {
    rules: {
      ...turboPackRulesetSVGR,
    },
  },
};
export default nextConfig;
