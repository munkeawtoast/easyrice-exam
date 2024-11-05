import { Link, createBrowserRouter } from 'react-router-dom';
import InspectionCreateUpdatePage from '../pages/inspection-cu';
import ResultListingPage from '../pages/result-listing';

const router = createBrowserRouter([
  {
    path: '/standard',
    element: <InspectionCreateUpdatePage isEditing={false} />,
  },
  {
    path: '/history',
    element: <ResultListingPage />,
  },
]);

export default router;
