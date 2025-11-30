import type { FastifyRequest } from "fastify";
import type { JwtClaims } from "../plugins/token.js";

type CustomFastifyRequest = FastifyRequest & {
  claims?: JwtClaims;
  params: { id: number };
};

export const ROLES = {
  Admin: 1,
  User: 2,
};

export function CanInteract() {
  return async (req: CustomFastifyRequest) => {
    if (!req.claims || !req.params || !("id" in req.params)) {
      throw new Error("not_authenticated");
    }

    if (
      req.claims.sub !== String(req.params.id) &&
      !req.claims.roles.includes(ROLES.Admin)
    ) {
      throw new Error("not_allowed");
    }
  };
}
