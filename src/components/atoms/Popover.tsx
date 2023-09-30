import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
  id?: string;
  Button: ReactNode;
  Content?: ReactNode;
  closed?: boolean;
  Classname?: { Button?: string; Content?: string };
}
export const Popover = (props: Props) => {
  const { closed, Button, Content, Classname } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [closed]);

  return (
    <div className={clsx('flex', Classname?.Button)} id={props.id}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="z-10 inline-flex flex-shrink-0 cursor-pointer items-center rounded-lg border border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100">
        {Button}
      </div>
      <div
        className={clsx(
          'absolute inset-x-auto z-10 m-0 hidden rounded-lg bg-white shadow-xl',
          open && '!block',
          Classname?.Content,
        )}>
        {Content}
      </div>
    </div>
  );
};
