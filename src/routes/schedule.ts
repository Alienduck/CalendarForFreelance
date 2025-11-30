import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { ZAvailabilitiesInput } from "../models/availabilities.js";
import { mapErr } from "../plugins/mapErr.js";
import { isLog } from "../utils/handlerConditions.js";

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
    { schema: { body: ZAvailabilitiesInput }, preHandler: isLog },
    async (req) => {
      try {
        const dispo = await repo.addAvailability(req.claims.sub, req.body);
        return { message: "Disponibilité ajoutée", availability: dispo[0] };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.delete(
    "/schedule/availabilities/:id",
    { schema: { params: z.object({ id: z.uuid() }) }, preHandler: isLog },
    async (req) => {
      await repo.deleteAvailability(req.params.id, req.claims.sub);
      return { message: "Disponibilité supprimée" };
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
