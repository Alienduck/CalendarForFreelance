// https://stackoverflow.com/questions/74193093/zod-validation-for-phone-numbers
import validator from "validator";
import z from "zod";

export const RdvStates = ["Schedule", "Cancel", "Defer", "Late", "Do"];

export const ZAppointment = z.object({
	id: z.uuid(),
	freelance_id: z.uuid(),
	client_name: z.coerce.string(),
	client_email: z.email(),
	client_phone: z.coerce.string().refine(validator.isMobilePhone),
	client_company: z.coerce.string(),
	start_date: z.coerce.date(),
	end_date: z.coerce.date(),
	status: z.enum(RdvStates),
	created_at: z.coerce.date(),
});

export const ZAppointmentInput = ZAppointment.omit({
	id: true,
	freelance_id: true,
	created_at: true,
});

export type Appointment = z.infer<typeof ZAppointment>;
export type AppointmentInput = z.infer<typeof ZAppointmentInput>;
