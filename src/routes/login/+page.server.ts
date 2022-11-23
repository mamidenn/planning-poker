import { set as setSessionCookie } from '$lib/sessioncookie';
import { invalid } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const name = data.get('name');

		if (!name) return invalid(400, { name, missing: true });
		setSessionCookie(cookies, { name: name as string, id: uuid() });
		return { success: true };
	}
};
