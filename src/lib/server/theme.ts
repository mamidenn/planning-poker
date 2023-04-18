import type { Theme } from '$lib/schema';
import all from '@skeletonlabs/skeleton/styles/all.css?inline';
import crimson from '@skeletonlabs/skeleton/themes/theme-crimson.css?inline';
import goldNouveau from '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css?inline';
import hamlindigo from '@skeletonlabs/skeleton/themes/theme-hamlindigo.css?inline';
import modern from '@skeletonlabs/skeleton/themes/theme-modern.css?inline';
import rocket from '@skeletonlabs/skeleton/themes/theme-rocket.css?inline';
import sahara from '@skeletonlabs/skeleton/themes/theme-sahara.css?inline';
import seafoam from '@skeletonlabs/skeleton/themes/theme-seafoam.css?inline';
import seasonal from '@skeletonlabs/skeleton/themes/theme-seasonal.css?inline';
import skeleton from '@skeletonlabs/skeleton/themes/theme-skeleton.css?inline';
import vintage from '@skeletonlabs/skeleton/themes/theme-vintage.css?inline';

const themes: Record<Theme, string> = {
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
		.replace('%sveltekit.themeCss%', '<style>' + themes[theme] + all + '</style>');
};
