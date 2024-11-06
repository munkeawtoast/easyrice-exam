import { Link, createBrowserRouter } from 'react-router-dom';
import InspectionFormPage from '../pages/inspection-form';
import HistoryListingPage from '../pages/history-listing';

const router = createBrowserRouter([
  {
    path: '/standard',
    element: <InspectionFormPage isEditing={false} />,
  },
  {
    path: '/history',
    element: <HistoryListingPage />,
  },
]);

export default router;
