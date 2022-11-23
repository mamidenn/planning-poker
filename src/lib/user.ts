import type { Cookies } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

interface User {
	id: string;
	name: string;
}

export const user = (cookies: Cookies) => {
	const get = () =>
		cookies.get('session', {
			decode: (value) => JSON.parse(decodeURIComponent(value))
		}) as User | undefined;

	const signup = (name: string) => {
		const user: User = { name, id: randomUUID() };
		cookies.set('session', JSON.stringify(user));
	};

	return { get, signup };
};
