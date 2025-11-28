import z from "zod";

export const ZDispo = z.object({
	user_id: z.coerce.number().int().min(1),
	date: z.coerce.date(),
});

export type Dispo = z.infer<typeof ZDispo>;
