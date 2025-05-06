import { id } from '@api/db/utils/column.util';
import { relations } from 'drizzle-orm';
import { jsonb, pgTable } from 'drizzle-orm/pg-core';

import { DocumentReferenceDB } from './document-reference.db';

export const DocumentDB = pgTable('document', {
  id: id('id'),
  content: jsonb('content'),
});

export const DocumentRelations = relations(DocumentDB, ({ many }) => ({
  references: many(DocumentReferenceDB, { relationName: 'parent' }),
}));
