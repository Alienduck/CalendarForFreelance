import z from "zod";

export const ZLink = z.object({
	user_id: z.coerce.number().int().min(1),
	url: z.coerce.string(),
	title: z.coerce.string(),
	icon: z.coerce.string(),
	position: z.coerce.string(),
});

export type Link = z.infer<typeof ZLink>;
