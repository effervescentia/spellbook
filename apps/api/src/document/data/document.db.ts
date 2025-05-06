import { id } from '@api/db/utils/column.util';
import { pgTable } from 'drizzle-orm/pg-core';

export const DocumentDB = pgTable('document', {
  id: id('id'),
});
