import type { Cookies } from '@sveltejs/kit';

export interface Session {
	id: string;
	name: string;
}

export const get = (cookies: Cookies) =>
	cookies.get('session', {
		decode: (value) => JSON.parse(decodeURIComponent(value))
	}) as Session | undefined;

export const set = (cookies: Cookies, session: Session) =>
	cookies.set('session', JSON.stringify(session));
