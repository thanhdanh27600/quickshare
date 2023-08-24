import { Menu } from '@styled-icons/feather';
import { DetailedHTMLProps, HTMLAttributes, MouseEvent } from 'react';

export type SelectOption<T> = {
  label: string;
  value: T;
};

interface Props<T> {
  ContainerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  options: SelectOption<T>[];
  value?: T;
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
          className="inline-flex h-16 flex-shrink-0 items-center rounded-l-lg border border-gray-300 bg-gray-100 py-2.5 px-4 text-center text-lg text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          type="button"
          data-te-dropdownanimation="off"
          data-te-offset={[0, 10]}>
          {props.value as any}
          <Menu className="w-4" />
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
                  className="p-4 hover:bg-gray-100"
                  onClick={(e) => {
                    props.handleSelect(option.value, e);
                  }}>
                  <p className="line-clamp-2">{option.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
