import type { Cookies } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

interface User {
	id: string;
	name: string;
}

export const namePattern = /^.{1,10}$/;

export const user = (cookies: Cookies) => {
	const get = () => {
		const user = cookies.get('session', {
			decode: (value) => JSON.parse(decodeURIComponent(value))
		}) as User | undefined;
		if (user && !(namePattern.test(user.name) && user.id)) throw new Error();
		return user;
	};

	const signup = (name: string) => {
		if (!namePattern.test(name)) throw new Error();
		const user: User = { name, id: randomUUID() };
		cookies.set('session', JSON.stringify(user));
	};

	return { get, signup };
};
