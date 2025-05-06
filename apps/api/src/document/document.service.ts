import type { DB } from '@api/db/db.types';
import { eq } from 'drizzle-orm';

import { DocumentDB } from './data/document.db';

export class DocumentService {
  constructor(private readonly db: DB) {}

  getWithReferences(documentID: string) {
    return this.db.query.DocumentDB.findFirst({
      where: eq(DocumentDB.id, documentID),
      with: { references: true },
    });
  }
}
