import z from "zod";

export const ZAvailabilities = z.object({
	id: z.uuid(),
	user_id: z.uuid(),
	day_of_week: z.coerce.number().int().min(0).max(6),
	date: z.coerce.date(),
	start_time: z.coerce.number().int().min(0).max(23),
	end_time: z.coerce.number().int().min(0).max(23),
	created_at: z.coerce.date(),
});

export const ZAvailabilitiesInput = ZAvailabilities.omit({
	id: true,
	user_id: true,
	created_at: true,
});

export type Availabilities = z.infer<typeof ZAvailabilities>;
