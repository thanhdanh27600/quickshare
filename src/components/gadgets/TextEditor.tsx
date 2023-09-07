import { useEffect } from 'react';
import { tinymce } from 'types/constants';

const TextEditor = ({defaultValue}: {defaultValue?: string}) => {
  useEffect(() => {
    if (!tinymce) return;
    tinymce.init({
      selector: `#text-editor`,
      height: 500,
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'help',
        'wordcount',
      ],
      toolbar:
        'bold italic backcolor link image alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'undo redo | blocks | ' +
        'removeformat | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    });
  }, []);

  return (
    <div>
      <textarea className="w-full h-[500px]" id={'text-editor'} defaultValue={defaultValue} placeholder='Write your note here...'></textarea>
    </div>
  );
}
TextEditor.displayName = 'TextEditor';

export default TextEditor;
