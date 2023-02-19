import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { user } from '$lib/user';

export const load: PageServerLoad = async ({ cookies }) => {
	const { logout } = user(cookies);
	logout();
	throw redirect(303, '/');
};
