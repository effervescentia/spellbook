import { type Static, t } from 'elysia';

export const Environment = t.Object({
  PORT: t.Number(),
});

export type Environment = Static<typeof Environment>;
