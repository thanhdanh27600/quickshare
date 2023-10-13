import clsx from 'clsx';
import { DetailedHTMLProps, ForwardedRef, InputHTMLAttributes, forwardRef, useId } from 'react';

interface CheckboxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
  labelClassname?: string;
}

export const Checkbox = forwardRef((props: CheckboxProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { label, labelClassname, ...otherProps } = props;
  const id = useId();
  return (
    <div className="flex items-center">
      <input
        {...otherProps}
        ref={ref}
        id={`checkbox-${id}`}
        type="checkbox"
        className={clsx(
          'h-4 w-4 cursor-pointer  border-gray-300 bg-gray-100 text-cyan-600 transition-all hover:border-gray-500 focus:ring-1 focus:ring-cyan-600 disabled:cursor-not-allowed',
          props.className,
        )}
      />

      {label && (
        <label htmlFor={`checkbox-${id}`} className={clsx('ml-2 cursor-pointer  text-gray-700', labelClassname)}>
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
