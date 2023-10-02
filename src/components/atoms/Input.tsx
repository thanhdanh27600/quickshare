import clsx from 'clsx';
import { DetailedHTMLProps, ForwardedRef, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Button, ButtonProps } from './Button';

interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  btnSize?: 'md' | 'lg';
}

export const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { btnSize = 'lg', ...otherProps } = props;
  return (
    <input
      {...otherProps}
      ref={ref}
      className={clsx(
        'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:shadow-[0_0_8px_0_#06b6d4] focus:outline-none focus:ring-cyan-500 disabled:cursor-not-allowed disabled:text-gray-400',
        {
          'h-16 sm:text-xl': btnSize === 'lg',
          'h-8': btnSize === 'md',
        },
        props.className,
      )}
    />
  );
});
Input.displayName = 'Input';

interface TextareaProps extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {}
export const Textarea = forwardRef((props: TextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const { ...otherProps } = props;
  return (
    <textarea
      {...otherProps}
      ref={ref}
      className={clsx(
        'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:shadow-[0_0_8px_0_#06b6d4] focus:outline-none focus:ring-cyan-500 disabled:text-gray-400 ',

        props.className,
      )}
    />
  );
});
Textarea.displayName = 'Textarea';

interface InputWithButtonProps extends InputProps {
  buttonChild?: string | JSX.Element;
  buttonProps: ButtonProps;
  Prefix?: JSX.Element;
}

export const InputWithButton = forwardRef((props: InputWithButtonProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { buttonProps, buttonChild, Prefix, ...inputProps } = props;
  return (
    <div className={clsx('relative w-full', Prefix && 'flex')}>
      {Prefix}
      <Input {...inputProps} ref={ref} className={clsx(inputProps.className, 'pr-[6.7rem] sm:pr-[10rem]')} />
      <Button
        {...buttonProps}
        className={clsx(
          'absolute right-0 top-0 h-full w-24 !rounded-none !rounded-r-lg text-lg sm:w-36',
          buttonProps.className,
        )}>
        {props.buttonChild}
      </Button>
    </div>
  );
});
InputWithButton.displayName = 'InputWithButton';
