import * as joi from 'joi';

interface EnvVars {
  EXTERNAL_API_ASSETS_URL: string;
  EXTERNAL_ASSETS_BASE_URL: string;
  APP_API_SECRET: string;
  APP_PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object({
    EXTERNAL_API_ASSETS_URL: joi.string().required(),
    EXTERNAL_ASSETS_BASE_URL: joi.string().required(),
    APP_API_SECRET: joi.string().required(),
    APP_PORT: joi.number().positive().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const validationResult = envsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(
    `❌ Invalid environment variables: ${validationResult.error.message}`,
  );
}

const validatedEnvs = validationResult.value as EnvVars;

// Export the validated environment variables
export const envs = {
  EXTERNAL_API_ASSETS_URL: validatedEnvs.EXTERNAL_API_ASSETS_URL,
  EXTERNAL_ASSETS_BASE_URL: validatedEnvs.EXTERNAL_ASSETS_BASE_URL,
  APP_API_SECRET: validatedEnvs.APP_API_SECRET,
  APP_PORT: validatedEnvs.APP_PORT,
  DATABASE_URL: validatedEnvs.DATABASE_URL,
} satisfies EnvVars;
