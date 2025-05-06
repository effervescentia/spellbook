import { id } from '@api/db/utils/column.util';
import { relations } from 'drizzle-orm';
import { index, pgTable, unique, uuid } from 'drizzle-orm/pg-core';

import { DocumentDB } from './document.db';

export const DocumentReferenceDB = pgTable(
  'document_reference',
  {
    id: id('id'),
    parentID: uuid('parent_id')
      .notNull()
      .references(() => DocumentDB.id),
    targetID: uuid('target_id')
      .notNull()
      .references(() => DocumentDB.id),
  },
  (table) => [
    unique().on(table.parentID, table.targetID),
    index().on(table.parentID),
    index().on(table.targetID),
    index().on(table.parentID, table.targetID),
  ],
);

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
