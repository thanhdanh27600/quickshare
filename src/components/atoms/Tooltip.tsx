import clsx from 'clsx';

type Props = React.PropsWithChildren & {
  show: boolean;
};

export const Tooltip = ({ show, children }: Props) => {
  if (!show) return <div className="hidden">{children}</div>;
  return <div className={clsx('absolute z-20 opacity-100')}>{children}</div>;
};
