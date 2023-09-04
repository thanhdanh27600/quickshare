import clsx, { ClassValue } from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loading } from './Loading';

type ButtonVariants = 'filled' | 'outlined';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string | React.ReactNode;
  TextClassname?: ClassValue;
  variant?: ButtonVariants;
  loading?: boolean;
  animation?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { text = 'Button', variant = 'filled', loading, animation, TextClassname, ...otherProps } = props;
  return (
    <button
      {...otherProps}
      className={clsx(
        'rounded-lg bg-gradient-to-l px-5 py-2 text-center text-sm font-medium transition-all focus:ring-2 disabled:bg-cyan-300 disabled:text-gray-300',
        {
          'py-2.5 text-white focus:outline-none focus:ring-cyan-400': variant === 'filled',
          'hover:gradient-bg from-purple-400 to-cyan-500': animation,
          'from-cyan-400 to-blue-400 hover:to-cyan-500': !animation,
          'relative inline-flex items-center justify-center overflow-hidden border border-cyan-300 bg-none p-1 text-gray-900  hover:text-cyan-500 focus:outline-none focus:ring-cyan-400':
            variant === 'outlined',
        },
        props.className,
      )}
      disabled={props.loading || props.disabled}>
      <span className={clsx('flex min-w-max items-center justify-center', TextClassname)}>
        {text}
        {props.loading && <Loading className="ml-2 !h-5 !w-5" />}
      </span>
    </button>
  );
};
