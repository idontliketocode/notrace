import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "#0a0a0a",
				accent: {
					indigo: "#6366f1",
					violet: "#8b5cf6",
					cyan: "#22d3ee",
				},
				muted: "#18181b",
				mutedForeground: "#a1a1aa",
			},
			borderRadius: {
				xl: "1rem",
				"2xl": "1.25rem",
			},
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};

export default config;
