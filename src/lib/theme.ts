import { browser } from '$app/environment';
import type { Theme } from '$lib/schema';
import all from '@skeletonlabs/skeleton/styles/all.css?inline';

const crimson = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-crimson.css?inline')).default;
const goldNouveau = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-gold-nouveau.css?inline')).default;
const hamlindigo = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-hamlindigo.css?inline')).default;
const modern = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-modern.css?inline')).default;
const rocket = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-rocket.css?inline')).default;
const sahara = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-sahara.css?inline')).default;
const seafoam = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-seafoam.css?inline')).default;
const seasonal = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-seasonal.css?inline')).default;
const skeleton = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-skeleton.css?inline')).default;
const vintage = async () =>
	(await import('@skeletonlabs/skeleton/themes/theme-vintage.css?inline')).default;

const themes: Record<Theme, () => Promise<string>> = {
	'gold-nouveau': goldNouveau,
	crimson: crimson,
	hamlindigo: hamlindigo,
	modern: modern,
	rocket: rocket,
	sahara: sahara,
	seafoam: seafoam,
	seasonal: seasonal,
	skeleton: skeleton,
	vintage: vintage
};

export const inject = async (html: string, theme: Theme) => {
	return html
		.replace('%sveltekit.theme%', `data-theme="${theme}"`)
		.replace(
			'%sveltekit.themeCss%',
			'<style id="themeCss">' + (await themes[theme]()) + all + '</style>'
		);
};

export const update = async (theme: Theme) => {
	if (!browser) return;
	const styleTag = document.getElementById('themeCss');
	if (styleTag) styleTag.textContent = (await themes[theme]()) + all;
	document.body.setAttribute('data-theme', theme);
};
