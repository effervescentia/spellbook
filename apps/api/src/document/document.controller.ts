import { DatabasePlugin } from '@api/db/db.plugin';
import { DocumentService } from '@api/document/document.service';
import Elysia, { t } from 'elysia';

import { DocumentDTO, DocumentWithSubresourcesDTO } from './data/document.dto';
import { DocumentContentDTO } from './data/document-content.dto';
import { DocumentReferenceDTO } from './data/document-reference.dto';
import { DocumentNotFoundError } from './document.error';

export const DocumentController = new Elysia({ prefix: '/document' })
  .use(DatabasePlugin)
  .use((app) =>
    app.decorate({ service: new DocumentService(app.decorator.db) }),
  )

  .get(
    '/:documentID',
    async ({ params, service }) => {
      const document = await service.getWithSubresources(params.documentID);
      if (!document) throw new DocumentNotFoundError(params.documentID);

      return {
        ...document,
        parentID: document.parent?.parentID ?? null,
        childIDs: document.children.map((child) => child.targetID),
      };
    },
    {
      params: t.Object({ documentID: t.String({ format: 'uuid' }) }),
      response: { 200: DocumentWithSubresourcesDTO },
    },
  )

  .put(
    '/:documentID/content',
    async ({ params, body, status, service }) => {
      await service.setContent(params.documentID, body.content);

      return status(204, undefined);
    },
    {
      params: t.Object({ documentID: t.String({ format: 'uuid' }) }),
      body: t.Object({ content: DocumentContentDTO }),
      response: { 204: t.Void() },
    },
  )

  .put(
    '/:documentID/parent/:parentID',
    async ({ params, status, service }) => {
      await service.upsertRelationship(params.documentID, params.parentID);

      return status(204, undefined);
    },
    {
      params: t.Object({
        documentID: t.String({ format: 'uuid' }),
        parentID: t.String({ format: 'uuid' }),
      }),
      response: { 204: t.Void() },
    },
  )

  .post(
    '/',
    async ({ body, status, service }) => {
      const document = await service.create(body.content);

      if (body.parentID) {
        await service.createRelationship(body.parentID, document.id);
      }

      return status(201, document);
    },
    {
      body: t.Object({
        content: DocumentContentDTO,
        parentID: t.Optional(t.String({ format: 'uuid' })),
      }),
      response: { 201: DocumentDTO },
    },
  )

  .post(
    '/:parentID/reference/:targetID',
    async ({ params, status, service }) => {
      const reference = await service.acquireReference(
        params.parentID,
        params.targetID,
      );

      return status(201, reference);
    },
    {
      params: t.Object({
        parentID: t.String({ format: 'uuid' }),
        targetID: t.String({ format: 'uuid' }),
      }),
      response: { 201: DocumentReferenceDTO },
    },
  )

  .delete(
    '/:parentID/reference/:targetID',
    async ({ params, status, service }) => {
      await service
        .deleteReference(params.parentID, params.targetID)
        .catch(() => null);

      return status(204, undefined);
    },
    {
      params: t.Object({
        parentID: t.String({ format: 'uuid' }),
        targetID: t.String({ format: 'uuid' }),
      }),
      response: { 204: t.Void() },
    },
  );
