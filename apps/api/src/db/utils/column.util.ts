import { jsonb, uuid } from 'drizzle-orm/pg-core';
import type { Static, TSchema } from 'elysia';

export const id = (name: string) =>
  uuid(name)
    .$defaultFn(() => Bun.randomUUIDv7())
    .primaryKey();

export const typedJSON = <T extends TSchema>(name: string, schema: T) =>
  jsonb(name)
    .$onUpdateFn((value) => value)
    .$type<Static<T>>();
