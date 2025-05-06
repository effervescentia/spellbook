import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import Elysia from 'elysia';

import * as schema from './db.schema';

export const DatabasePlugin = new Elysia({ name: 'plugin.database' }).use(
  (app) => {
    const client = new PGlite({ dataDir: './data.db' });
    const db = drizzle({ client, schema });

    return app.decorate({ db });
  },
);
