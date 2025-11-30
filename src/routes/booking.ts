import { addMinutes } from "date-fns";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { mapErr } from "../plugins/mapErr.js";
import { calculateFreeSlots, SLOT_DURATION } from "../utils/slots.js";

export async function bookingRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  const repo = new Repository();

  fastify.get(
    "/:username/slots",
    {
      schema: {
        params: z.object({ username: z.string() }),
        querystring: z.object({
          date: z.coerce.date(),
        }),
      },
    },
    async (req) => {
      try {
        const { username } = req.params;
        const { date } = req.query;

        const user = await repo.getUserProfile(username);
        if (!user) throw new Error("User not found");

        const dayOfWeek = new Date(date).getDay();

        const [availabilities, appointments] = await Promise.all([
          repo.getAvailabilities(user.id, dayOfWeek),
          repo.getAppointments(user.id, date),
        ]);

        const slots = calculateFreeSlots(date, availabilities, appointments);

        return { slots, message: "Slots available" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.post(
    "/:username/reserve",
    {
      schema: {
        params: z.object({ username: z.string() }),
        body: z.object({
          client_name: z.string().min(2),
          client_email: z.email(),
          date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          time: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm
        }),
      },
    },
    async (req) => {
      try {
        const { username } = req.params;
        const { client_name, client_email, date, time } = req.body;

        const user = await repo.getUserProfile(username);
        if (!user) throw new Error("User not found");

        const start_date = new Date(`${date}T${time}:00`);
        const end_date = addMinutes(start_date, SLOT_DURATION);

        await repo.createAppointment({
          freelance_id: user.id,
          client_name,
          client_email,
          start_date,
          end_date,
        });

        return { success: true, message: "Appointment confirmed" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );
}
