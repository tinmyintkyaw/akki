import logger from "@/configs/logger-config";
import envValidationSchema from "@/validations/env-validation-schema";

function validateEnvVariables() {
  const validationResult = envValidationSchema.validate(process.env);

  if (validationResult.error) {
    logger.error(validationResult.error.message);
    logger.error("Invalid environment variables");
    process.exit(1);
  }
}

export default validateEnvVariables;
