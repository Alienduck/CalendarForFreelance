import z from "zod";

export const ZRegister = z.object({
  username: z.coerce.string().default("No Username"),
  full_name: z.coerce.string().default("No Name"),
  email: z.email(),
  password: z.coerce.string(),
});

export type Register = z.infer<typeof ZRegister>;
