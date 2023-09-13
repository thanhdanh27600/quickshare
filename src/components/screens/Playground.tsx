import { Sidebar } from 'components/atoms/Sidebar';
import { isProduction } from 'types/constants';

export const Playground = () => {
  const log = () => {};

  if (isProduction) return null;

  return (
    <>
      <h1 className="my-8 text-xl font-bold">Playground</h1>
      <Sidebar />
      {/* <FileUpload /> */}
      {/* <TextEditor /> */}
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
};
