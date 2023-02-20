import type { Actions, PageServerLoad } from './$types';
import { randomInt } from 'crypto';
import _ from 'lodash';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const randomId = _.range(8).reduce((acc) => acc + randomInt(36).toString(36), '');
	throw redirect(302, `/${randomId}`);
};

export const actions: Actions = {
	setTheme: async ({ cookies, request }) => {
		const data = await request.formData();
		const theme = data.get('theme') as string | null;
		if (theme) cookies.set('theme', theme);
		return;
	}
};
