import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, RouterProvider } from 'react-router-dom';

import router from './router';
import Navbar from './components/navbar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
  </StrictMode>
);
