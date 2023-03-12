import clsx from 'clsx';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';
import { Button, ButtonProps } from './Button';

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}

export const Input = forwardRef((props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <input
      {...props}
      ref={ref}
      className="block h-16 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-[6.7rem] text-gray-900 focus:shadow-[0_0_8px_0_#06b6d4] focus:outline-none focus:ring-cyan-500 sm:pr-[8.6rem] sm:text-xl"
    />
  );
});
Input.displayName = 'Input';
interface InputWithButtonProps extends Props {
  buttonChild?: string | JSX.Element;
  buttonProps: ButtonProps;
}

export const InputWithButton = forwardRef((props: InputWithButtonProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { buttonProps, buttonChild, ...inputProps } = props;
  return (
    <div className="relative w-full">
      <Input {...inputProps} ref={ref} />
      <Button
        {...buttonProps}
        className={clsx(
          'absolute top-0 right-0 h-full w-24 rounded-none rounded-r-lg text-lg sm:w-32',
          buttonProps.className,
        )}>
        {props.buttonChild}
      </Button>
    </div>
  );
});
InputWithButton.displayName = 'InputWithButton';
