import { theme as themeSchema } from '$lib/schema';
import { inject as injectTheme } from '$lib/theme';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const usedTheme = themeSchema.parse(event.cookies.get('theme'));
	return await resolve(event, {
		transformPageChunk: async ({ html }) => await injectTheme(html, usedTheme)
	});
};
