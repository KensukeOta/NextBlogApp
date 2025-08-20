export const DefaultLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`h-full bg-white ${className}`}>{children}</div>;
};
