import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { namePattern, user } from '$lib/user';

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const { signup } = user(cookies);
		const data = await request.formData();
		const name = data.get('name')?.toString();

		if (!name) return fail(400, { name, validation: { name: 'Cannot be empty.' } });
		if (!namePattern.test(name)) return fail(400, { name, validation: { name: 'Invalid name.' } });
		signup(name);
		throw redirect(303, url.searchParams.get('url') || '/');
	}
};
