import z from "zod";

export const ZUser = z.object({
	user_id: z.coerce.number().int().min(1),
	name: z.coerce.string(),
	full_name: z.coerce.string(),
	bio: z.coerce.string(),
	job: z.coerce.string(),
	avatar: z.coerce.string(),
});

export type User = z.infer<typeof ZUser>;
