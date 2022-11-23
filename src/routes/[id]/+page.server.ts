import { get as getSessionCookie } from '$lib/sessioncookie';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const TemporaryRedirect = 307;

export const load: PageServerLoad = async ({ cookies, params }) => {
	const session = getSessionCookie(cookies);
	if (!session) throw redirect(TemporaryRedirect, '/login');
	return { session, id: params.id };
};
