import type { ClassNameValue } from "tailwind-merge";
import cn from "../utils/cn";

interface ButtonProps {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	className?: ClassNameValue;
	type: HTMLButtonElement["type"];
}

export default function Button({
	children,
	type,
	onClick,
	className,
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={cn(
				"text-white bg-black px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-150",
				className,
			)}
		>
			{children}
		</button>
	);
}
