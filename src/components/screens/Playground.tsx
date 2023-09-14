import { UploadBlob } from 'components/atoms/UploadBlob';

export const Playground = () => {
  const log = () => {};

  // if (isProduction) return null;

  return (
    <>
      <h1 className="my-8 text-xl font-bold">Playground</h1>
      <UploadBlob />
      {/* <Sidebar /> */}
      {/* <TextEditor /> */}
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
};
