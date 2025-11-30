import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import {
  type AuthAccountInput,
  ZAuthAccountInput,
} from "../models/auth_account.js";
import { ZRegister } from "../models/register.js";
import type { UserInput } from "../models/user.js";
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
          const auth_account = repo.postAuthAccount(user.id, {
            email: req.body.email,
            password_hash: await repo.hashPassword(req.body.password_hash),
          } as AuthAccountInput);
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

  fastify.post(
    "/auth/register",
    {
      schema: {
        body: ZRegister,
      },
    },
    async (req, reply) => {
      const { username, full_name, email, password } = req.body;

      try {
        const users = await repo.postUser({
          username,
          full_name,
        } as UserInput);

        if (!users || users.length === 0) {
          throw new Error("Failed to create user");
        }
        const newUser = users[0];

        const hashedPassword = await repo.hashPassword(password);

        await repo.postAuthAccount(newUser.id, {
          email: email,
          password_hash: hashedPassword,
        } as AuthAccountInput);

        return reply.status(201).send({
          message: "Account created successfully",
          user: newUser,
        });
      } catch (err) {
        server.log.error(err);
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
