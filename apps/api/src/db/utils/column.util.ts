import { varchar } from 'drizzle-orm/pg-core';

export const uuidV7 = (name: string) => varchar(name, { length: 36 });

export const id = (name: string) =>
  uuidV7(name)
    .$defaultFn(() => Bun.randomUUIDv7())
    .primaryKey();
