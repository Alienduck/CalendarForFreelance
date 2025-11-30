import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { ZAuthAccountInput } from "../models/auth_account.js";
import { mapErr } from "../plugins/mapErr.js";

export async function authAccountRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  const repo = new Repository();

  fastify.get("/auth_account", async () => {
    try {
      const auth_accounts = await repo.getAuthAccounts();
      if (!auth_accounts) {
        throw new Error("Auth Accounts not found");
      }
      return { auth_accounts, message: "find auth accounts" };
    } catch (err) {
      throw mapErr(err);
    }
  });

  fastify.get(
    "/user/:id/auth_account",
    {
      schema: {
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req) => {
      try {
        const auth_account = await repo.getAuthAccount(req.params.id);
        if (!auth_account) {
          throw new Error("Auth Account not found");
        }
        return { auth_account, message: "Auth Account found" };
      } catch (err) {
        mapErr(err);
      }
    },
  );

  fastify.post(
    "/user/:id/auth_account",
    {
      schema: {
        params: z.object({ id: z.uuid() }),
        body: ZAuthAccountInput,
      },
    },
    async (req) => {
      try {
        const user = await repo.getUser(req.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        try {
          const auth_account = repo.postAuthAccount(user.id, req.body);
          if (!auth_account) {
            throw new Error("Failed to create Auth Account");
          }
          return { auth_account, message: "Success to create Auth Account" };
        } catch (err) {
          throw mapErr(err);
        }
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.put(
    "/user/:id/auth_account",
    {
      schema: {
        params: z.object({ id: z.uuid() }),
        body: ZAuthAccountInput,
      },
    },
    async (req) => {
      try {
        const user = await repo.getUser(req.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        try {
          const auth_account = repo.updateAuthAccount(user.id, req.body);
          if (!auth_account) {
            throw new Error("Failed to create Auth Account");
          }
          return { auth_account, message: "Success to create Auth Account" };
        } catch (err) {
          throw mapErr(err);
        }
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.delete(
    "/user/:id/auth_account",
    {
      schema: {
        params: z.object({ id: z.uuid() }),
      },
    },
    async (req) => {
      try {
        const user = await repo.getUser(req.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        try {
          const auth_account = repo.deleteAuthAccount(user.id);
          if (!auth_account) {
            throw new Error("Failed to create Auth Account");
          }
          return { auth_account, message: "Success to create Auth Account" };
        } catch (err) {
          throw mapErr(err);
        }
      } catch (err) {
        throw mapErr(err);
      }
    },
  );
}
