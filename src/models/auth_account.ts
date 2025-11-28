import z from "zod";

export const ZAuthAccount = z.object({
	user_id: z.uuid(),
	email: z.email(),
	password_hash: z.coerce.string(),
	create_at: z.coerce.date(),
});

export const ZAuthAccountInput = ZAuthAccount.omit({
	user_id: true,
	created_at: true,
});

export type AuthAccount = z.infer<typeof ZAuthAccount>;
export type AuthAccountInput = z.infer<typeof ZAuthAccountInput>;
