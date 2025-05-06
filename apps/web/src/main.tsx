import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/app.component';
import { AppProvider } from './app/app.provider';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
