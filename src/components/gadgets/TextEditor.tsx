import { useEffect } from 'react';
import { tinymce } from 'types/constants';

const TextEditor = ({ defaultValue }: { defaultValue?: string }) => {
  useEffect(() => {
    if (!tinymce) return;
    tinymce.init({
      selector: `#text-editor`,
      block_unsupported_drop: true,
      paste_block_drop: true,
      paste_data_images: true,
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
        'wordcount',
      ],
      toolbar:
        'bold italic backcolor link image alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'undo redo | blocks | removeformat',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    });
  }, []);

  return (
    <div>
      <textarea
        className="h-[500px] w-full"
        id={'text-editor'}
        defaultValue={defaultValue}
        placeholder="Write your note here..."></textarea>
    </div>
  );
};
TextEditor.displayName = 'TextEditor';

export default TextEditor;
