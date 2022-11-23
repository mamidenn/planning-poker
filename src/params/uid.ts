import type { ParamMatcher } from '@sveltejs/kit';

export const length = 8;
export const pattern = new RegExp(`^[\\da-z]{${length}}$`);

export const match: ParamMatcher = (param) => pattern.test(param);
