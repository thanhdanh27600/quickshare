import { Menu } from '@styled-icons/feather';
import clsx from 'clsx';
import { DetailedHTMLProps, HTMLAttributes, MouseEvent, ReactNode } from 'react';

export type SelectOption<T> = {
  label: string | ReactNode;
  value: T;
};

interface Props<T> {
  ContainerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  buttonClassName?: string;
  options: SelectOption<T>[];
  value?: T;
  icon?: React.ReactNode;
  handleSelect: (value: T, e?: MouseEvent<HTMLDivElement>) => void;
}

export function Dropdown<T>(props: Props<T>) {
  return (
    <div {...props.ContainerProps}>
      <div className="relative" data-te-dropdown-ref>
        <button
          id="dropdown-button"
          data-te-dropdown-toggle-ref
          aria-expanded="false"
          className={clsx(
            'inline-flex h-16 flex-shrink-0 items-center border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-lg text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300',
            props.buttonClassName,
          )}
          type="button"
          data-te-dropdownanimation="off"
          data-te-offset={[0, 10]}>
          {props.icon || (
            <>
              {props.value as any}
              <Menu className="w-4" />
            </>
          )}
        </button>
        <ul
          aria-labelledby="dropdown-button"
          data-te-dropdown-menu-ref
          className="min-w-64 z-10 hidden w-max max-w-sm divide-y divide-gray-100 rounded-lg bg-white text-gray-700 shadow md:max-w-xl [&[data-te-dropdown-show]]:block">
          {props.options.map((option, index) => {
            return (
              <li key={`${option.label}-${index}`}>
                <div
                  data-te-dropdown-item-ref
                  className={clsx('cursor-pointer rounded-lg p-4 hover:bg-gray-100', {
                    'bg-gray-100/80': props.value === option.value,
                  })}
                  onClick={(e) => {
                    props.handleSelect(option.value, e);
                  }}>
                  <div className="line-clamp-2">{option.label}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
