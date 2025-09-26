// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Register the service worker
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { registerSW } from 'virtual:pwa-register';

import { App } from './App';
import './index.css';

registerSW(); // auto-update enabled

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App />,
  // </StrictMode>,
);
