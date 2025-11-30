import type { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify, SignJWT } from "jose";

export type JwtClaims = {
  sub: string;
  roles: number[];
  iat: number;
  exp: number;
};

// on creation, iat and exp are set automatically, we don't need to receive them:
type CreateJwtOption = Omit<JwtClaims, "iat" | "exp">;

export class TokenManager {
  #secret: Uint8Array;

  constructor(secret_str?: string | Uint8Array) {
    const src = secret_str ?? process.env?.JWT_SECRET;
    if (!src) {
      throw new Error(
        "JWT_SECRET is not set and no secret was provided on construction",
      );
    }
    if (src instanceof Uint8Array) this.#secret = src;
    else this.#secret = fromBase64url(src);
  }
  async encode(claims: CreateJwtOption): Promise<string> {
    const { sub, roles } = claims;

    const token = await new SignJWT({ roles })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(sub)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(this.#secret);
    return token;
  }

  async verify(encoded_token: string): Promise<JwtClaims> {
    const { payload } = (await jwtVerify(encoded_token, this.#secret, {
      algorithms: ["HS256"],
    })) as { payload: JwtClaims }; // JWTPayload type missing field roles (non le commentaire est pas de chat GPT)

    payload.roles = payload.roles as number[]; // Init roles in case it's missing

    return payload;
  }
}

function fromBase64url(source: string): Uint8Array {
  const base64 = source.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(padded, "base64"));
  }
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function requireRole(role: number) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    if (!req.claims) {
      res.status(401).send({ error: "missing_or_invalid_token" });
      return;
    }

    if (!req.claims.roles.includes(role)) {
      res.status(403).send({ error: "forbidden_missing_role", required: role });
      return;
    }
  };
}
