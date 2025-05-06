import { type Static, t } from 'elysia';

export type DocumentContent = Static<typeof DocumentContentDTO>;

export const DocumentContentDTO = t.Object({
  blocks: t.Array(t.Object({})),
});
