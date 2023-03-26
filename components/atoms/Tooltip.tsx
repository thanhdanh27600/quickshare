import clsx from 'clsx';

type Props = React.PropsWithChildren & {
  show: boolean;
};

export const Tooltip = ({ show, children }: Props) => {
  return (
    <div className={clsx('absolute z-0 opacity-0 transition-opacity', show && 'z-20 opacity-100')}>{children}</div>
  );
};
