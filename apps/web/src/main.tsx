import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Navbar from './components/navbar';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import ContentPadding from './components/content-padding';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Navbar />
    <ContentPadding>
      <RouterProvider router={router} />
    </ContentPadding>
  </StrictMode>
);
