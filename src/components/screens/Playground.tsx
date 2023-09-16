import Auth from 'components/atoms/Auth';

export const Playground = () => {
  const log = () => {};

  // if (isProduction) return null;

  return (
    <>
      <h1 className="my-8 text-xl font-bold">Playground</h1>
      <Auth />
      {/* <BlobUploader /> */}
      {/* <Sidebar /> */}
      {/* <TextEditor /> */}
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
};
