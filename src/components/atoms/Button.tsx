import clsx, { ClassValue } from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loading } from './Loading';

type ButtonVariants = 'filled' | 'outlined';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string | React.ReactNode;
  TextClassname?: ClassValue;
  variant?: ButtonVariants;
  loading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const { text = 'Button', variant = 'filled', loading, TextClassname, ...otherProps } = props;
  return (
    <button
      {...otherProps}
      className={clsx(
        'rounded-lg bg-gradient-to-br px-5 py-2 text-center text-sm font-medium transition-all focus:ring-2 disabled:from-cyan-300 disabled:to-blue-400 disabled:text-gray-300',
        {
          'from-cyan-500 to-blue-500 py-2.5 text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-cyan-400':
            variant === 'filled',
          'relative inline-flex items-center justify-center overflow-hidden border border-cyan-300 p-1 text-gray-900  hover:text-cyan-500 focus:outline-none focus:ring-cyan-400':
            variant === 'outlined',
        },
        props.className,
      )}
      disabled={props.loading || props.disabled}>
      <span
        className={clsx(
          'flex min-w-max justify-center',
          {
            'rounded-md bg-white transition-all duration-75 ease-in group-hover:bg-opacity-0': variant === 'outlined',
          },
          TextClassname,
        )}>
        {props.loading ? <Loading className="!h-5 !w-5" /> : text}
      </span>
    </button>
  );
};
