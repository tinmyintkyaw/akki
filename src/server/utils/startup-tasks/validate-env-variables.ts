import envValidationSchema from "@/validations/env-validation-schema";

function validateEnvVariables() {
  const validationResult = envValidationSchema.validate(process.env);

  if (validationResult.error) {
    console.log(validationResult.error.message);
    console.log("Invalid environment variables");
    process.exit(1);
  }
}

export default validateEnvVariables;
