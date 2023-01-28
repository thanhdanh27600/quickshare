import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	InputHTMLAttributes,
} from "react";

interface Props
	extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {}

export const Input = forwardRef(
	(props: Props, ref: ForwardedRef<HTMLInputElement>) => {
		return (
			<input
				{...props}
				ref={ref}
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-blue-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 focus-visible:outline-cyan-700"
			/>
		);
	}
);
