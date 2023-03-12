import Script from 'next/script';
import { useId } from 'react';
import { BASE_URL } from 'types/constants';

interface Props {
  children: JSX.Element | JSX.Element[];
  title?: string[];
}

export const Accordion = ({ children, title }: Props) => {
  const l = (children as []).length ?? 1;

  const id = useId().replaceAll(':', '-');

  return (
    <div id={`accordion${id}`}>
      <Script src={`${BASE_URL}/lib/styles.min.js`} />
      {(((children as []).length ? children : [children]) as []).map((c, i) => {
        return (
          <div key={`k${id}${i}`} className="rounded-none border-none border-neutral-200">
            <h2 className="mb-0 hover:text-cyan-500 hover:underline" id={`heading${id}${i}`}>
              <button
                className="[&:not([data-te-collapse-collapsed])]:text-primary group relative flex w-full items-center rounded-none border-0 py-4 text-left text-base transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none"
                type="button"
                data-te-collapse-init
                data-te-collapse-collapsed
                data-te-target={`#collapse${id}${i}`}
                aria-controls={`collapse${id}${i}`}>
                <span className="h-4 w-4 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:rotate-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
                <span className="ml-2 text-lg">{title?.at(i) ?? 'Heading'}</span>
              </button>
            </h2>
            <div
              id={`collapse${id}${i}`}
              className="!visible hidden border-0"
              data-te-collapse-item
              aria-labelledby={`heading${id}${i}`}>
              <div>{c}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
