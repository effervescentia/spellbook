import { DatabasePlugin } from '@api/db/db.plugin';
import Elysia from 'elysia';

export const DocumentController = new Elysia({ prefix: '/document' })
  .use(DatabasePlugin);
