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
    <div className={'relative flex'} id={props.id}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className={clsx('z-10 inline-flex flex-shrink-0 cursor-pointer items-center', props.Classname?.Button)}>
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
