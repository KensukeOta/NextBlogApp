export const DefaultLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`h-full bg-gray-100 ${className}`}>{children}</div>;
};
