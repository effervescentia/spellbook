import { id } from '@api/db/utils/column.util';
import { relations } from '@api/db/utils/relations.util';
import { jsonb, pgTable } from 'drizzle-orm/pg-core';

import type { DocumentContent } from './document-content.dto';
import { DocumentReferenceDB } from './document-reference.db';
import { DocumentRelationshipDB } from './document-relationship.db';

export const DocumentDB = pgTable('document', {
  id: id('id'),
  content: jsonb('content').notNull().$type<DocumentContent>(),
});

export const DocumentRelations = relations(DocumentDB, ({ one, many }) => ({
  parent: one(DocumentRelationshipDB, {
    fields: [DocumentDB.id],
    references: [DocumentRelationshipDB.targetID],
    optional: true,
  }),

  references: many(DocumentReferenceDB, { relationName: 'parent' }),

  children: many(DocumentRelationshipDB, { relationName: 'parent' }),
}));
