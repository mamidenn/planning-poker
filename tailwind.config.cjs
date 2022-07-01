/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundImage: {
				'card-back-pattern': "url('/images/card-back.svg')"
			}
		}
	},
	plugins: []
};
