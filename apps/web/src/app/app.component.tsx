import { match } from 'ts-pattern';

import { useRoute } from './app.router';

export const App: React.FC = () => {
  const route = useRoute();

  return match(route).otherwise(() => null);
};
