import type { DB } from '@api/db/db.types';
import { and, eq } from 'drizzle-orm';

import { DocumentDB } from './data/document.db';
import type { DocumentContent } from './data/document-content.dto';
import { DocumentReferenceDB } from './data/document-reference.db';
import { DocumentRelationshipDB } from './data/document-relationship.db';

export class DocumentService {
  constructor(private readonly db: DB) {}

  async create(content: DocumentContent) {
    const [document] = await this.db
      .insert(DocumentDB)
      .values({ content })
      .returning();
    return document;
  }

  async setContent(documentID: string, content: DocumentContent) {
    await this.db
      .update(DocumentDB)
      .set({ content })
      .where(eq(DocumentDB.id, documentID));
  }

  getWithSubresources(documentID: string) {
    return this.db.query.DocumentDB.findFirst({
      where: eq(DocumentDB.id, documentID),
      with: { references: true, relationships: true },
    });
  }

  async acquireReference(parentID: string, targetID: string) {
    const [reference] = await this.db
      .insert(DocumentReferenceDB)
      .values({ parentID, targetID })
      .onConflictDoUpdate({
        target: [DocumentReferenceDB.parentID, DocumentReferenceDB.targetID],
        set: {},
      })
      .returning();
    return reference;
  }

  async deleteReference(parentID: string, targetID: string) {
    await this.db
      .delete(DocumentReferenceDB)
      .where(
        and(
          eq(DocumentReferenceDB.parentID, parentID),
          eq(DocumentReferenceDB.targetID, targetID),
        ),
      );
  }

  async createRelationship(parentID: string, targetID: string) {
    await this.db.insert(DocumentRelationshipDB).values({ parentID, targetID });
  }
}
