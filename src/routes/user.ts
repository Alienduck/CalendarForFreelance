import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Repository } from "../db/db.js";
import { type User, ZUserInput } from "../models/user.js";
import { mapErr } from "../plugins/mapErr.js";

export async function userRoutes(server: FastifyInstance) {
  const fastify = server.withTypeProvider<ZodTypeProvider>();
  const repo = new Repository();

  fastify.get(
    "/:username",
    {
      schema: {
        params: z.object({ username: z.string() }),
      },
    },
    async (req) => {
      try {
        const res: User = await repo.getUserProfile(req.params.username);
        if (!res) {
          throw new Error("User not found");
        }
        return { user: res, message: "User found." };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.get("/user", async () => {
    try {
      const users = repo.getUsers();
      if (!users) {
        throw new Error("Fail to get users");
      }
      return { users };
    } catch (err) {
      throw mapErr(err);
    }
  });

  fastify.get(
    "/user/:id",
    {
      schema: {
        params: z.object({ id: z.coerce.number().int().min(1) }),
      },
    },
    async (req) => {
      try {
        const user = repo.getUser(req.params.id);
        if (!user) {
          throw new Error("User not found");
        }
        return { user, message: "User found" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.post(
    "/user",
    {
      schema: {
        body: ZUserInput,
      },
    },
    async (req) => {
      try {
        const res = await repo.postUser(req.body);
        if (!res) {
          throw new Error("Fail to create new user");
        }
        return { user: res, message: "New user created" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.put(
    "/user/:id",
    {
      schema: {
        params: z.object({ id: z.coerce.number().int().min(1) }),
        body: ZUserInput,
      },
    },
    async (req) => {
      try {
        const user = await repo.updateUser(req.params.id, req.body);
        if (!user) {
          throw new Error("Fail to update");
        }
        return { user, message: "New user updated" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );

  fastify.delete(
    "/user/:id",
    {
      schema: {
        params: z.object({ id: z.coerce.number().int().min(1) }),
      },
    },
    async (req) => {
      try {
        const user = repo.deleteUser(req.params.id);
        if (!user) {
          throw new Error("Fail to delete user");
        }
        return { user, message: "User deleted" };
      } catch (err) {
        throw mapErr(err);
      }
    },
  );
}
