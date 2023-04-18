import { z } from 'zod';

export const theme = z
	.union([
		z.literal('crimson'),
		z.literal('gold-nouveau'),
		z.literal('hamlindigo'),
		z.literal('modern'),
		z.literal('rocket'),
		z.literal('sahara'),
		z.literal('seafoam'),
		z.literal('seasonal'),
		z.literal('skeleton'),
		z.literal('vintage')
	])
	.catch('skeleton');

export type Theme = z.infer<typeof theme>;
