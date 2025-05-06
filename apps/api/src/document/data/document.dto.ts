import { type Static, t } from 'elysia';

export type Document = Static<typeof DocumentDTO>;

export const DocumentDTO = t.Object({
  id: t.String({ format: 'uuid' }),
});
