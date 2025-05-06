import { NotFoundError } from 'elysia';

export class DocumentNotFoundError extends NotFoundError {
  constructor(documentID: string) {
    super(`no document found with ID '${documentID}'`);
  }
}
