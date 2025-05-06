import { uuid } from 'drizzle-orm/pg-core';

export const id = (name: string) =>
  uuid(name)
    .$defaultFn(() => Bun.randomUUIDv7())
    .primaryKey();
