import { Environment } from '@api/app/app.env';
import Elysia from 'elysia';
import envSchema from 'env-schema';

export const EnvironmentPlugin = new Elysia({ name: 'plugin.environment' }).use(
  (app) => {
    const env = envSchema<Environment>({
      schema: Environment,
      dotenv: import.meta.env.NODE_ENV === 'development',
    });

    return app.decorate({ env });
  },
);
