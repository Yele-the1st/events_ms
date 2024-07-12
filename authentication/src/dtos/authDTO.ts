// src/dtos/authDTO.ts

import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignUpDTO = z.infer<typeof SignUpSchema>;
export type SignInDTO = z.infer<typeof SignInSchema>;
