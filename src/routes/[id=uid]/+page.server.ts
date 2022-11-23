import { user } from '$lib/user';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const TemporaryRedirect = 302;

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	const { get } = user(cookies);
	const u = get();
	if (!u) throw redirect(TemporaryRedirect, `/login?url=${url.toString()}`);

	return { user: u, id: params.id };
};
