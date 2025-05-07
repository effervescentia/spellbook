import { type Static, t } from 'elysia';

import { DocumentContentDTO } from './document-content.dto';
import { DocumentReferenceDTO } from './document-reference.dto';

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
    parentID: t.Nullable(t.String({ format: 'uuid' })),
    childIDs: t.Array(t.String({ format: 'uuid' })),
    references: t.Array(DocumentReferenceDTO),
  }),
]);
