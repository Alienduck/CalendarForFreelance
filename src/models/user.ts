import z from "zod";

export const ZUser = z.object({
	id: z.uuid(),
	username: z.string().default("username"),
	full_name: z.string().default("no name"),
	bio: z.string().nullable(),
	job_title: z.string().nullable(),
	avatar_url: z.string().nullable(),
	created_at: z.date(),
	updated_at: z.date(),
});

export const ZUserInput = ZUser.omit({
	created_at: true,
	updated_at: true,
	id: true,
});

export const ZUserInputPartial = ZUserInput.partial();

export type User = z.infer<typeof ZUser>;
export type UserInput = z.infer<typeof ZUserInput>;
export type UserInputPartial = z.infer<typeof ZUserInputPartial>;
