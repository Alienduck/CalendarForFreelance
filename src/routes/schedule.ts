import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { mapErr } from "../plugins/mapErr.js";
import { isLog } from "../utils/handlerConditions.js";

const AvailabilityInput = z.object({
  day_of_week: z.number().min(0).max(6).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
});

export async function scheduleRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  const repo = new Repository();

  fastify.addHook("preHandler", async (req, reply) => {
    if (!req.claims) {
      return reply.status(401).send({ error: "Non authentifié" });
    }
  });

  fastify.get(
    "/schedule/availabilities",
    {
      preHandler: isLog,
    },
    async (req) => {
      const dispos = await repo.getAllAvailabilities(req.claims.sub);
      return { availabilities: dispos };
    },
  );

  fastify.post(
    "/schedule/availabilities",
    { schema: { body: AvailabilityInput } },
    async (req) => {
      try {
        console.log("=== POST /schedule/availabilities ===");
        console.log("req.claims:", req.claims);
        console.log("req.body:", req.body);
        if (!req.claims || !req.claims.sub) throw new Error("Non connecté");
        if (req.body.day_of_week === undefined && req.body.date === undefined) {
          throw new Error("Il faut préciser un jour de semaine ou une date");
        }

        const dispo = await repo.addAvailability(req.claims.sub, req.body);
        return { message: "Disponibilité ajoutée", availability: dispo };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.delete(
    "/schedule/availabilities/:id",
    { schema: { params: z.object({ id: z.uuid() }) }, preHandler: isLog },
    async (req) => {
      const availbility = await repo.deleteAvailability(
        req.params.id,
        req.claims.sub,
      );
      return { availbility, message: "Disponibilité supprimée" };
    },
  );

  fastify.get("/schedule/appointments", { preHandler: isLog }, async (req) => {
    const appts = await repo.getFreelanceAppointments(req.claims.sub);
    return { appointments: appts };
  });

  fastify.patch(
    "/schedule/appointments/:id/cancel",
    { schema: { params: z.object({ id: z.uuid() }) }, preHandler: isLog },
    async (req) => {
      await repo.cancelAppointment(req.params.id, req.claims.sub);
      return { message: "Rendez-vous annulé" };
    },
  );
}
