import { theme as themeSchema } from '$lib/schema';
import { inject as injectTheme } from '$lib/server/theme';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const usedTheme = themeSchema.catch('skeleton').parse(event.cookies.get('theme'));
	return await resolve(event, {
		transformPageChunk: async ({ html }) => await injectTheme(html, usedTheme)
	});
};
