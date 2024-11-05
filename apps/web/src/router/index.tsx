import { Link, createBrowserRouter } from 'react-router-dom';
import InspectionFormPage from '../pages/inspection-form';
import ResultListingPage from '../pages/result-listing';

const router = createBrowserRouter([
  {
    path: '/standard',
    element: <InspectionFormPage isEditing={false} />,
  },
  {
    path: '/history',
    element: <ResultListingPage />,
  },
]);

export default router;
