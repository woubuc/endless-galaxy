import packageJson from './package.json';

export default {
	target: 'static',
	ssr: false,

	env: {
		NODE_ENV: process.env.NODE_ENV,
		SERVER_BASE_URL: process.env.SERVER_BASE_URL,
	},

	head: {
		title: 'Endless Galaxy',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: packageJson.description || '' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=JetBrains+Mono:wght@400;600&display=swap' },
		],
	},

	css: [],

	plugins: [],

	buildModules: [
		'@nuxt/typescript-build',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/svg',
	],

	modules: [
		'nuxt-i18n',
	],

	build: {},

	i18n: {
		strategy: 'prefix',
		parsePages: false,
		locales: [
			{ code: 'en', name: 'English', file: 'en.js' },
			{ code: 'nl', name: 'Nederlands', file: 'nl.js' },
			{ code: 'fr', name: 'Français', file: 'fr.js' },
		],
		lazy: true,
		langDir: './i18n/',
		defaultLocale: 'en',
	},

	tailwindcss: {
		jit: true,
	},
};
