import Elysia, { StatusMap } from 'elysia';
import { createLogger } from 'logixlysia';

function getStatusCode(status: string | number): number {
  if (typeof status === 'number') {
    return status;
  }
  return (StatusMap as Record<string, number>)[status] || 500;
}

export const LoggerPlugin = new Elysia({ name: 'plugin.logger' }).use((app) => {
  const log = createLogger();

  return app
    .decorate({ log })
    .onStart((ctx) => {
      const { hostname, port, protocol } = ctx.server as {
        hostname?: string;
        port?: number;
        protocol?: string;
      };
      console.log(`🦊 Elysia is running at ${protocol}://${hostname}:${port}`);
    })
    .onRequest((ctx) => {
      ctx.store = { beforeTime: process.hrtime.bigint() };
    })
    .onAfterHandle({ as: 'global' }, ({ request, set, store }) => {
      log.log(
        'INFO',
        request,
        {
          status: getStatusCode(set.status ?? 200),
          message: String(set.headers?.['x-message'] || ''),
        },
        store as { beforeTime: bigint },
      );
    })
    .onError({ as: 'global' }, ({ request, error, set, store }) => {
      log.handleHttpError(
        request,
        { ...error, status: getStatusCode(set.status ?? 500) } as Parameters<
          typeof log.handleHttpError
        >[1],
        store as { beforeTime: bigint },
      );
    });
});
