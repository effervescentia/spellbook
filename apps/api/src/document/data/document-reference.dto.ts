import { type Static, t } from 'elysia';

export type DocumentReference = Static<typeof DocumentReferenceDTO>;

export const DocumentReferenceDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  parentID: t.String({ format: 'uuid' }),
  targetID: t.String({ format: 'uuid' }),
});
