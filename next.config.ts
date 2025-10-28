import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: { remotePatterns: [] },
	experimental: {
		reactCompiler: false,
	},
};

export default nextConfig;
