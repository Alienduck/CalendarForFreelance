// https://stackoverflow.com/questions/74193093/zod-validation-for-phone-numbers
import validator from "validator";
import z from "zod";

export const RdvStates = ["Schedule", "Cancel", "Defer", "Late", "Do"];

export const ZRdv = z.object({
	user_id: z.coerce.number().int().min(1),
	client_name: z.coerce.string(),
	client_email: z.email(),
	client_tel: z.coerce.string().refine(validator.isMobilePhone),
	client_societe: z.coerce.string(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	state: z.enum(RdvStates),
});

export type Rdv = z.infer<typeof ZRdv>;
