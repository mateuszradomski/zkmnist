import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		copy({
			targets: [
				{ src: "node_modules/**/*.wasm", dest: "node_modules/.vite/deps" },
			],
			copySync: true,
			hook: "buildStart",
		}),
	],
	esbuild: {
		target: "esnext",
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
	server: {
		port: 2137,
	},
});
