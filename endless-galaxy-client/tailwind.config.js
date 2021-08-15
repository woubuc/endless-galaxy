const colors = require('tailwindcss/colors');

module.exports = {
	theme: {
		colors: {
			...colors,
			gray: colors.warmGray,
		},
		fontFamily: {
			body: `'Exo 2', sans-serif`,
			mono: `'Jetbrains Mono', monospace`,
		},
		extend: {
			backgroundColor: {
				transparent: 'transparent',
			}
		},
	},
};
