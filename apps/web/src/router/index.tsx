import { Link, createBrowserRouter } from 'react-router-dom';
import InspectionFormPage from '../pages/inspection-form';
import HistoryListingPage from '../pages/history-listing';
import ResultSingle from '../pages/result-single';
import InspectionFormEditPage from '../pages/inspection-form-edit';
import { NavbarWrapper } from '../components/navbar-wrapper';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper />,
    children: [
      {
        path: '/standard',
        element: <InspectionFormPage />,
      },
      {
        path: '/standard/:id',
        element: <InspectionFormEditPage />,
      },
      {
        path: '/history',
        element: <HistoryListingPage />,
      },
      {
        path: '/history/:id',
        element: <ResultSingle />,
      },
    ],
  },
]);

export default router;
