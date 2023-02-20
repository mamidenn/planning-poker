import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	await import(`../../node_modules/@skeletonlabs/skeleton/themes/theme-${data.theme}.css`);

	return data;
};
