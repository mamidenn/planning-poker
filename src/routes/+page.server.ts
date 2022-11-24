import type { PageServerLoad } from './$types';
import { randomInt } from 'crypto';
import { range } from 'lodash';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const randomId = range(8).reduce((acc) => acc + randomInt(36).toString(36), '');
	throw redirect(302, `/${randomId}`);
};
