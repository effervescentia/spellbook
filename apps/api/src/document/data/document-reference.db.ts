import { relations } from 'drizzle-orm';
import { pgTable, uuid } from 'drizzle-orm/pg-core';

import { DocumentDB } from './document.db';

export const DocumentReferenceDB = pgTable('document_reference', {
  parentID: uuid('parent_id').references(() => DocumentDB.id),
  targetID: uuid('target_id').references(() => DocumentDB.id),
});

export const DocumentReferenceRelations = relations(
  DocumentReferenceDB,
  ({ one }) => ({
    parent: one(DocumentDB, {
      fields: [DocumentReferenceDB.parentID],
      references: [DocumentDB.id],
    }),

    target: one(DocumentDB, {
      fields: [DocumentReferenceDB.targetID],
      references: [DocumentDB.id],
    }),
  }),
);
