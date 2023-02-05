import React, {
	DetailedHTMLProps,
	ForwardedRef,
	forwardRef,
	InputHTMLAttributes,
} from "react";
import {Button, ButtonProps} from "./Button";

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
				className="block h-12 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xl text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 focus-visible:outline-cyan-500 dark:border-cyan-600 dark:bg-cyan-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
			/>
		);
	}
);
Input.displayName = "Input";
interface InputWithButtonProps extends Props {
	buttonChild?: string | JSX.Element;
	buttonProps: ButtonProps;
}

export const InputWithButton = forwardRef(
	(props: InputWithButtonProps, ref: ForwardedRef<HTMLInputElement>) => {
		const {buttonProps, buttonChild, ...inputProps} = props;
		return (
			<div className="relative w-full">
				<Input {...inputProps} ref={ref} />
				<Button
					{...buttonProps}
					className="absolute top-0 right-0 h-full rounded-none rounded-r-lg text-lg"
				>
					{props.buttonChild}
				</Button>
			</div>
		);
	}
);
InputWithButton.displayName = "InputWithButton";
