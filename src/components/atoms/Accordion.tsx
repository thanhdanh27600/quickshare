import { useId } from 'react';

interface Props {
  children: JSX.Element;
  title?: string | JSX.Element;
  className?: string;
}

export const Accordion = ({ children, title, className }: Props) => {
  const id = useId().replaceAll(':', '-');
  return (
    <div id={`accordion${id}`} className={className}>
      <div key={`k${id}`} className="rounded-none border-none border-neutral-200">
        <h3 className="mb-0 hover:text-cyan-500 hover:underline" id={`heading${id}`}>
          <button
            className="[&:not([data-te-collapse-collapsed])]:text-primary group relative flex w-full items-center rounded-none border-0 py-4 text-left text-base transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none"
            type="button"
            data-te-collapse-init
            data-te-collapse-collapsed
            data-te-target={`#collapse${id}`}
            aria-controls={`collapse${id}`}>
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
            <span className="ml-2 text-lg">{title || 'Heading'}</span>
          </button>
        </h3>
        <div
          id={`collapse${id}`}
          className="!visible hidden border-0"
          data-te-collapse-item
          aria-labelledby={`heading${id}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
