import { Button } from '@libs/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import z from 'zod';

type Props = {};

const searchSchema = z.object({
  idFilter: z.string().min(2, {
    message: 'Must be at least 2 characters',
  }),
});

const ResultListingPage = (props: Props) => {
  return (
    <div className="flex justify-end">
      <Button>
        <Plus className="w-4 h-4" />
        Create Inspection
      </Button>
    </div>
  );
};

export default ResultListingPage;
