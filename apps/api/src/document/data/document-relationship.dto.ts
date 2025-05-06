import { type Static, t } from 'elysia';

export type DocumentRelationship = Static<typeof DocumentRelationshipDTO>;

export const DocumentRelationshipDTO = t.Object({
  parentID: t.String({ format: 'uuid' }),
  targetID: t.String({ format: 'uuid' }),
});
