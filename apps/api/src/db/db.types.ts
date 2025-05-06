import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core';
import type { PgliteDatabase } from 'drizzle-orm/pglite';

import * as schema from './db.schema';

export type DB = PgliteDatabase<typeof schema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transaction = PgTransaction<PgQueryResultHKT, any, any>;
