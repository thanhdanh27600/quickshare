import clsx from 'clsx';

type Props = React.PropsWithChildren & {
  show: boolean;
};

export const Tooltip = ({ show, children }: Props) => {
  return <div className={clsx('absolute z-10 opacity-0 transition-opacity', show && 'opacity-100')}>{children}</div>;
};
