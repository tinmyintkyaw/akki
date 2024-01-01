import { RequestSchema } from "@/middlewares/request-validator.js";
import validatorjs from "validator";
import { z } from "zod";

const { default: validator } = validatorjs;

const signInPayloadSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .refine(
      (val) => validator.isAlphanumeric(val) && validator.isLowercase(val),
    ),
  password: z
    .string()
    .trim()
    .refine((val) => validator.isStrongPassword(val)),
});

const signUpPayloadSchema = signInPayloadSchema.merge(
  z.object({
    name: z.string().trim().min(1).max(30),
  }),
);

const usernameSignInSchema: RequestSchema = {
  body: signInPayloadSchema,
};

const usernameSignUpSchema: RequestSchema = {
  body: signUpPayloadSchema,
};

export { usernameSignInSchema, usernameSignUpSchema };
