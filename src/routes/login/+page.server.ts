import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { user } from '$lib/user';

export const actions: Actions = {
	default: async ({ cookies, request, url }) => {
		const { signup } = user(cookies);
		const data = await request.formData();
		const name = data.get('name')?.toString();

		if (!name) return invalid(400, { name, missing: true });
		signup(name);
		throw redirect(303, url.searchParams.get('url') || '/');
	}
};
