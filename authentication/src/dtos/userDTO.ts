import { z } from "zod";

export const CreateUserDto = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AuthenticateUserDto = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const UpdateUserDto = z.object({
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
});

export const VerifyTokenDto = z.object({
  token: z.string().nonempty("Token is required"),
});

export const VerifyMFATokenDto = z.object({
  userId: z.string().nonempty("User ID is required"),
  token: z.string().nonempty("Token is required"),
});

export const UpdatePasswordDto = z.object({
  userId: z.string().nonempty("User ID is required"),
  oldPassword: z
    .string()
    .min(6, "Old password must be at least 6 characters long"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long"),
});
