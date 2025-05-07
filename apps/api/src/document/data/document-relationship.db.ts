import { relations } from 'drizzle-orm';
import { index, pgTable, uuid } from 'drizzle-orm/pg-core';

import { DocumentDB } from './document.db';

export const DocumentRelationshipDB = pgTable(
  'document_relationship',
  {
    parentID: uuid('parent_id')
      .notNull()
      .references(() => DocumentDB.id),
    targetID: uuid('target_id')
      .notNull()
      .unique()
      .references(() => DocumentDB.id, { onDelete: 'cascade' }),
  },
  (table) => [
    index().on(table.parentID),
    index().on(table.targetID),
    index().on(table.parentID, table.targetID),
  ],
);

export const DocumentRelationshipRelations = relations(
  DocumentRelationshipDB,
  ({ one }) => ({
    parent: one(DocumentDB, {
      fields: [DocumentRelationshipDB.parentID],
      references: [DocumentDB.id],
      relationName: 'parent',
    }),

    target: one(DocumentDB, {
      fields: [DocumentRelationshipDB.targetID],
      references: [DocumentDB.id],
      relationName: 'target',
    }),
  }),
);
