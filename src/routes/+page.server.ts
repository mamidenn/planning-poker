import { theme as themeSchema } from '$lib/schema';
import { redirect } from '@sveltejs/kit';
import { randomInt } from 'crypto';
import _ from 'lodash';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const randomId = _.range(8).reduce((acc) => acc + randomInt(36).toString(36), '');
	throw redirect(302, `/${randomId}`);
};

export const actions: Actions = {
	setTheme: async ({ cookies, request }) => {
		const data = await request.formData();
		const theme = themeSchema.removeCatch().parse(data.get('theme'));
		cookies.set('theme', theme);
		return;
	}
};
