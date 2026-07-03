import { type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClassName = cn(
  "h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500",
  "transition-colors focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/20",
);

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClassName, className)} {...props} />;
}
