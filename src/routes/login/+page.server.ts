import { set as setSessionCookie } from '$lib/sessioncookie';
import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from 'crypto';

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) return invalid(400, { name, missing: true });
		setSessionCookie(cookies, { name: name as string, id: randomUUID() });
		throw redirect(303, url.searchParams.get('url') || '/');
	}
};
