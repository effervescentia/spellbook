import { type Static, t } from 'elysia';

import { DocumentContentDTO } from './document-content.dto';
import { DocumentReferenceDTO } from './document-reference.dto';

export type Document = Static<typeof DocumentDTO>;

export const DocumentDTO = t.Object({
  id: t.String({ format: 'uuid' }),
  content: DocumentContentDTO,
});

export type DocumentWithReferences = Static<typeof DocumentWithReferencesDTO>;

export const DocumentWithReferencesDTO = t.Composite([
  DocumentDTO,
  t.Object({
    references: t.Array(DocumentReferenceDTO),
  }),
]);
