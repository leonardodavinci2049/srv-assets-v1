import * as joi from 'joi';

interface EnvVars {
  APP_API_URL: string;
  APP_API_SECRET: string;
  APP_PORT: number;
}

const envsSchema = joi
  .object({
    APP_API_URL: joi.string().required(),
    APP_API_SECRET: joi.string().required(),
    APP_PORT: joi.number().positive().required(),
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
  APP_API_URL: validatedEnvs.APP_API_URL,
  APP_API_SECRET: validatedEnvs.APP_API_SECRET,
  APP_PORT: validatedEnvs.APP_PORT,
} satisfies EnvVars;
