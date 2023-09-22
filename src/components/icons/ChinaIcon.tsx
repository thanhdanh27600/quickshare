export const ChinaIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version={'1.0'}
      viewBox="0 0 630 420"
      {...props}>
      <defs>
        <path
          id="star"
          d="m0-22 4.715 15.511h15.257l-12.343 8.968 4.714 14.51-12.343-8.968-12.343 8.968 4.714-14.51-12.343-8.968h15.257z"
          fill="#f6e204"
        />
      </defs>
      <rect width={630} height={420} fill="#e20212" /> <use xlinkHref="#star" transform="scale(3) translate(35,35)" />
      <use xlinkHref="#star" transform="translate(210,42) rotate(23.036)" />
      <use xlinkHref="#star" transform="translate(252,84) rotate(45.87)" />
      <use xlinkHref="#star" transform="translate(252,147) rotate(69.945)" />
      <use xlinkHref="#star" transform="translate(210,189) rotate(20.66)" />
    </svg>
  );
};
