/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				'main-color': {
					50: '#e2e2ff',
					100: '#c0c0ff',
					200: '#9b9bff',
					300: '#7676ff',
					400: '#5858ff',
					500: '#5252e8', // main color
					600: '#4a4ad4',
					700: '#4141c0',
					800: '#3838ac',
					900: '#2e2e99',
				},
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			gridTemplateColumns: {
				auto: 'repeat(auto-fit, minmax(200px, 1fr))',
			},
		},
	},
	plugins: [],
};
