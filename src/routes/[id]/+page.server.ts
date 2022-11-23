import { get as getSessionCookie } from '$lib/sessioncookie';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const TemporaryRedirect = 302;

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	const session = getSessionCookie(cookies);
	if (!session) throw redirect(TemporaryRedirect, `/login?url=${url.toString()}`);

	return { session, id: params.id };
};
