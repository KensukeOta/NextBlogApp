import { useFormStatus } from "react-dom";

export const SubmitButton = ({
  children,
  className = "w-full mt-4 p-2 bg-black text-white hover:opacity-70"
}: {
  children: React.ReactNode,
  className?: string
}) => {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {children}
    </button>
  );
};