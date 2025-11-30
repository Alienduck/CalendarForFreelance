import z from "zod";

export const ZUser = z.object({
  id: z.uuid(),
  username: z.string().default("username"),
  full_name: z.string().default("no name"),
  bio: z.string().default("Bio in progress..."),
  job_title: z.string().default("No job ?"),
  avatar_url: z.string().default("path_to_default_avatar"),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ZUserInput = ZUser.omit({
  created_at: true,
  updated_at: true,
  id: true,
});

export const ZUserInputPartial = ZUserInput.partial();

export type User = z.infer<typeof ZUser>;
export type UserInput = z.infer<typeof ZUserInput>;
export type UserInputPartial = z.infer<typeof ZUserInputPartial>;
