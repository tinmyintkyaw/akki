import Joi from "joi";

export const usernameSigninPayloadSchema = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .lowercase()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
});

export const usernameSignupPayloadSchema = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .lowercase()
    .min(3)
    .max(30)
    .required(),
  name: Joi.string().trim().min(1).max(30).required(),
  password: Joi.string()
    .trim()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
});
