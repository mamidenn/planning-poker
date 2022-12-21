import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { user } from '$lib/user';

export const actions: Actions = {
	default: async ({ cookies }) => {
		const { logout } = user(cookies);
		logout();
		throw redirect(303, '/');
	}
};
