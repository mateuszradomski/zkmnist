import type { ClassNameValue } from "tailwind-merge";
import cn from "../utils/cn";

type TextareaProps = {
	value: string;
	setValue: (value: string) => void;
	className?: ClassNameValue;
	placeholder?: string;
};

export default function Textarea({
	className,
	placeholder,
	value,
	setValue,
}: TextareaProps) {
	return (
		<textarea
			placeholder={placeholder}
			value={value}
			onChange={(e) => setValue(e.currentTarget.value)}
			className={cn(
				"bg-gray-200 rounded border p-1 font-medium border-gray-300 w-full min-h-20",
				className,
			)}
		/>
	);
}
