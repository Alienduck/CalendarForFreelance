import z from "zod";

export const ZAuthAccount = z.object({
	user_id: z.coerce.number().int().min(1),
	email: z.email(),
	password_hash: z.coerce.string,
});

export type AuthAccount = z.infer<typeof ZAuthAccount>;
