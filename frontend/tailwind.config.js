/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				dark: "#0d0d0d",
				main: "#e3602a",
				secondary: "#2d190e",
			},
		},
	},
	plugins: [],
};
