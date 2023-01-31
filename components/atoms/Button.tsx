import clsx from "clsx";
import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";
import {Loading} from "./Loading";

type ButtonColors = "cyan";
type ButtonVariants = "filled" | "outlined";

export interface ButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	text?: string;
	color?: ButtonColors;
	variant?: ButtonVariants;
	loading?: boolean;
}

export const Button = (props: ButtonProps) => {
	const {
		text = "Button",
		color = "cyan",
		variant = "filled",
		loading,
		...otherProps
	} = props;
	return (
		<button
			{...otherProps}
			className={clsx(
				"rounded-lg bg-gradient-to-br text-center text-sm font-medium focus:ring-2 ",
				{
					"px-5 py-2.5 text-white hover:bg-gradient-to-bl focus:outline-none dark:focus:ring-cyan-800":
						color === "cyan" && variant === "filled",

					"focus:outline-non group relative inline-flex items-center justify-center overflow-hidden p-0.5 text-gray-900 hover:text-white group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800":
						color === "cyan" && variant === "outlined",
					"from-cyan-500 to-blue-500 focus:ring-cyan-400": color === "cyan",
				},
				props.className
			)}
		>
			<span
				className={clsx("flex min-h-[1.2rem] min-w-max",{
					"relative max-h-4 rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900":
						variant === "outlined",
				})}
			>
				{props.loading ? <Loading className="!h-5 !w-5" /> : text}
			</span>
		</button>
	);
};
