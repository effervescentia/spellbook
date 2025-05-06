import { DatabasePlugin } from '@api/db/db.plugin';
import { DocumentService } from '@api/document/document.service';
import Elysia, { t } from 'elysia';

import { DocumentWithReferencesDTO } from './data/document.dto';
import { DocumentNotFoundError } from './document.error';

export const DocumentController = new Elysia({ prefix: '/document' })
  .use(DatabasePlugin)
  .use((app) =>
    app.decorate({ service: new DocumentService(app.decorator.db) }),
  )

  .get(
    '/:documentID',
    async ({ params, service }) => {
      const document = await service.getWithReferences(params.documentID);
      if (!document) throw new DocumentNotFoundError(params.documentID);

      return document;
    },
    {
      params: t.Object({ documentID: t.String() }),
      response: { 200: DocumentWithReferencesDTO },
    },
  );
