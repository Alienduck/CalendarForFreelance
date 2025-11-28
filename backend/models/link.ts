import z from "zod";

export const ZLink = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	url: z.coerce.string(),
	title: z.coerce.string(),
	icon: z.coerce.string(),
	position: z.coerce.string(),
	created_at: z.coerce.date(),
});

export const ZLinkInput = ZLink.omit({ id: true, user_id: true, created_at: true });

export type Link = z.infer<typeof ZLink>;
export type LinkInput = z.infer<typeof ZLinkInput>;
