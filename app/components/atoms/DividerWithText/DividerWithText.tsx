export const DividerWithText = () => {
  return (
    <div className="flex items-center">
      <hr role="separator" className="grow border-t border-gray-300" />
      <span className="px-4 text-sm text-gray-500">または</span>
      <hr role="separator" className="grow border-t border-gray-300" />
    </div>
  );
};
