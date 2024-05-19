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
		<label className="flex flex-col gap-1 h-full text-main">
			<span className="font-medium">{label}</span>

			<textarea
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				className={cn(
					"rounded border p-2 font-medium w-full min-h-20 bg-dark border-gray-600 outline-none text-gray-300 focus:border-main transition-all duration-150",
					className,
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
		<label className="flex flex-col gap-1 text-main">
			<span className="font-medium">{label}</span>
			<input
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.currentTarget.value)}
				className={cn(
					"rounded border p-2 font-medium w-full bg-dark focus:border-main border-gray-600 outline-none text-gray-300 transition-all duration-150",
					className,
				)}
			/>
		</label>
	);
}
