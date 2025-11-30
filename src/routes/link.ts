import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { ZLinkInput } from "../models/link.js";
import { mapErr } from "../plugins/mapErr.js";

export async function linkRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  const repo = new Repository();

  // Ajouter un lien
  fastify.post(
    "/links",
    {
      schema: {
        body: ZLinkInput,
      },
    },
    async (req, reply) => {
      if (!req.claims)
        return reply.status(401).send({ error: "Non authentifié" });

      try {
        const link = await repo.addLink(req.claims.sub, req.body);
        return { message: "Lien ajouté", link: link[0] };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );
  fastify.delete(
    "/links/:id",
    {
      schema: {
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req, reply) => {
      if (!req.claims)
        return reply.status(401).send({ error: "Non authentifié" });

      try {
        const deleted = await repo.deleteLink(req.params.id, req.claims.sub);
        if (deleted.length === 0) {
          return reply
            .status(404)
            .send({ error: "Lien introuvable ou non autorisé" });
        }
        return { message: "Lien supprimé" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );
}
