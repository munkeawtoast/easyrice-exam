type Props =
  | {
      isEditing: true;
      referenceId: string;
    }
  | {
      isEditing: false;
    };

const InspectionCreateUpdatePage = (props: Props) => {
  return <div>InspectionPage</div>;
};

export default InspectionCreateUpdatePage;
