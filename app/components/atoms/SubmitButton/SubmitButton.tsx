"use client";

import { useFormStatus } from "react-dom";

export const SubmitButton = ({
  children,
  className = "w-full mt-4 p-2 bg-black text-white hover:opacity-70",
  ariaLabel,
}: {
  children: React.ReactNode,
  className?: string,
  ariaLabel?: any,
}) => {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};