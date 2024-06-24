export const DefaultLayout = ({
  children,
  className,
}: {
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <div className={`bg-gray-100 h-full ${className}`}>
      {children}
    </div>
  );
};