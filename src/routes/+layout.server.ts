import type { LayoutServerLoad } from './$types';
import { theme as themeSchema } from '$lib/schema';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const theme = themeSchema.parse(cookies.get('theme'));

	return { theme };
};
