type Props = {
  header: string;
  children?: React.ReactNode;
};

const InspectionResultItem = (props: Props) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{props.header}:</div>
      {props.children}
    </div>
  );
};

export default InspectionResultItem;
