import "dotenv/config";
import cookie, { type FastifyCookieOptions } from "@fastify/cookie";
import cors from "@fastify/cors";
import { addHours } from "date-fns";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
// import { Repository } from "./db/db.js";
import { AppError } from "./plugins/mapErr.js";
import { type JwtClaims, TokenManager } from "./plugins/token.js";
import { authAccountRoutes } from "./routes/auth_account.js";
import { bookingRoutes } from "./routes/booking.js";
import { linkRoutes } from "./routes/link.js";
import { scheduleRoutes } from "./routes/schedule.js";
import { userRoutes } from "./routes/user.js";
import { ROLES } from "./utils/handlerConditions.js";

declare module "fastify" {
  interface FastifyRequest {
    claims?: JwtClaims;
  }
}

function start_web_server() {
  const web_server = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>();
  const token_manager = new TokenManager();

  web_server.register(cookie, {
    secret: process.env.JWT_SECRET,
    parseOptions: {},
  } as FastifyCookieOptions);
  web_server.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  web_server.setValidatorCompiler(validatorCompiler);
  web_server.setSerializerCompiler(serializerCompiler);

  // const repo = new Repository();

  web_server.get("/", async () => {
    return { message: "Hello world !" };
  });

  web_server.addHook("preHandler", async (req) => {
    const token = req.cookies.access_token;
    if (!token) {
      req.claims = undefined;
      return;
    }
    try {
      const claims = await token_manager.verify(token);
      req.claims = claims;
    } catch (err) {
      req.log.error(err, "Auth: Echec vérification token")
      req.claims = undefined;
    }
  });

  web_server.get("/token", async (req, res) => {
    const token = await token_manager.encode({
      sub: "example",
      roles: req.claims ? req.claims.roles : [ROLES.User],
    });
    res.setCookie("access_token", token, {
      secure: false, // TODO set to true in production
      sameSite: false,
      expires: addHours(new Date(), 1),
    });
    res.status(204);
  });

  web_server.get("/api/claims", async (req) => {
    if (!req.claims) {
      throw new Error("not authenticated");
    }

    return req.claims;
  });

  web_server.register(userRoutes, { prefix: "/api" });
  web_server.register(bookingRoutes, { prefix: "/api" });
  web_server.register(authAccountRoutes, { prefix: "/api" });
  web_server.register(linkRoutes, { prefix: "/api" });
  web_server.register(scheduleRoutes, { prefix: "/api" });

  web_server.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof AppError) {
      reply.status(error.status).send({ error: error.message });
    }

    reply.status(500).send({ message: "Internal Server Error" });
  });

  web_server.listen({ port: 1234, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`listening on ${address}`);
    }
  });
}

start_web_server();
