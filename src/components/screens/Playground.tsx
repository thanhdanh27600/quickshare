import TextEditor from 'components/gadgets/TextEditor';
import { useRef } from 'react';
import { isProduction } from 'types/constants';

export const Playground = () => {
  const editorRef = useRef<any>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current);
    }
  };

  if (isProduction) return null;

  return (
    <>
      <h1 className="my-8 text-xl font-bold">Playground</h1>
      <TextEditor ref={editorRef} />
      <button onClick={log}>Log editor content</button>
    </>
  );
};
