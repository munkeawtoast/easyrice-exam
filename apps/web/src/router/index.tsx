import { Link, createBrowserRouter } from 'react-router-dom';
import InspectionFormPage from '../pages/inspection-form';
import HistoryListingPage from '../pages/history-listing';
import ResultSingle from '../pages/result-single';

const router = createBrowserRouter([
  {
    path: '/standard',
    element: <InspectionFormPage isEditing={false} />,
  },
  {
    path: '/history',
    element: <HistoryListingPage />,
  },
  {
    path: '/history/:id',
    element: <ResultSingle />,
  },
]);

export default router;
