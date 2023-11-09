import Joi from "joi";

const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .trim()
    .valid("production", "development", "test")
    .required(),
  PORT: Joi.number().default(3300),

  //   Google OAuth
  GOOGLE_OAUTH_ENABLED: Joi.boolean(),
  GOOGLE_CLIENT_ID: Joi.string()
    .trim()
    .default("")
    .when("GOOGLE_OAUTH_ENABLED", {
      is: true,
      then: Joi.required(),
    }),
  GOOGLE_CLIENT_SECRET: Joi.string()
    .trim()
    .default("")
    .when("GOOGLE_OAUTH_ENABLED", {
      is: true,
      then: Joi.required(),
    }),
  GOOGLE_REDIRECT_URI: Joi.string()
    .trim()
    .default("")
    .when("GOOGLE_OAUTH_ENABLED", {
      is: true,
      then: Joi.required(),
    }),

  //   GitHub OAuth
  GITHUB_OAUTH_ENABLED: Joi.boolean(),
  GITHUB_CLIENT_ID: Joi.string()
    .trim()
    .default("")
    .when("GITHUB_OAUTH_ENABLED", {
      is: true,
      then: Joi.required(),
    }),
  GITHUB_CLIENT_SECRET: Joi.string()
    .trim()
    .default("")
    .when("GITHUB_OAUTH_ENABLED", {
      is: true,
      then: Joi.required(),
    }),

  //   Typesense client config
  TYPESENSE_HOST: Joi.string().trim().default("localhost"),
  TYPESENSE_PORT: Joi.number().default(8108),
  TYPESENSE_API_KEY: Joi.string().trim().required(),

  //   Demo mode
  DEMO_MODE: Joi.boolean().default(false),
}).unknown();

export default envValidationSchema;
