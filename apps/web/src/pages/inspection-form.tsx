import z from 'zod';
type Props =
  | {
      isEditing: true;
      referenceId: string;
    }
  | {
      isEditing: false;
    };

const formSchema = z.object({
  name: z.string().nonempty(),
});

const InspectionFormPage = (props: Props) => {
  return <div>InspectionPage</div>;
};

export default InspectionFormPage;
