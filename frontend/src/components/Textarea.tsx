import type { ClassNameValue } from "tailwind-merge";
import cn from "../utils/cn";

type TextareaProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  className?: ClassNameValue;
  placeholder?: string;
};

export default function Textarea({
  label,
  className,
  placeholder,
  value,
  setValue,
}: TextareaProps) {
  return (
    <label className="flex flex-col gap-1 h-full">
      <span className="font-medium">{label}</span>

      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className={cn(
          "bg-gray-200 rounded border p-1 font-medium border-gray-300 w-full min-h-20",
          className
        )}
      />
    </label>
  );
}

export function Input({
  label,
  className,
  placeholder,
  value,
  setValue,
}: TextareaProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-medium">{label}</span>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className={cn(
          "bg-gray-200 rounded border p-1 font-medium border-gray-300 w-full",
          className
        )}
      />
    </label>
  );
}
