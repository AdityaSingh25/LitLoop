export const LabelledInput = (props: any) => {
  return (
    <div className="flex flex-col gap-4">
      <div>{props.label}</div>
      <input
        className="border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={props.placeholder}
      />
    </div>
  );
};
