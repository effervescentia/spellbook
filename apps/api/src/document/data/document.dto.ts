import { type Static, t } from 'elysia';

import { DocumentContentDTO } from './document-content.dto';
import { DocumentReferenceDTO } from './document-reference.dto';
import { DocumentRelationshipDTO } from './document-relationship.dto';

export type Document = Static<typeof DocumentDTO>;

export const DocumentDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  content: DocumentContentDTO,
});

export type DocumentWithSubresources = Static<
  typeof DocumentWithSubresourcesDTO
>;

export const DocumentWithSubresourcesDTO = t.Composite([
  DocumentDTO,
  t.Object({
    references: t.Array(DocumentReferenceDTO),
    relationships: t.Array(DocumentRelationshipDTO),
  }),
]);
