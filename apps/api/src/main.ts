import { App } from './app/app.module';

export type * from './app/app.interface';
export type * from './app/app.module';

App.use((app) => app.listen(app.decorator.env.PORT));
