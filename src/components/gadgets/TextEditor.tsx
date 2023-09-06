import { forwardRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles

const fontSizeArr = [
  '10px',
  '12px',
  '14px',
  '16px',
  '18px', // default
  '20px',
  '24px',
  '32px',
  '42px',
  '54px',
  '68px',
  '84px',
  '98px',
];

var Size = ReactQuill.Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
ReactQuill.Quill.register(Size, true);

const TextEditor = forwardRef<ReactQuill>((props, ref) => {
  const [editorHtml, setEditorHtml] = useState<string>('');

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', { color: [] }, { background: [] }, 'link', 'image'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { header: [1, 2, 3, 4, 5, 6, false] },
        { size: fontSizeArr },
        { align: [] },
        'code',
        'clean',
      ],
    ],
  };

  const formats = [
    'header',
    'color',
    'code',
    'size',
    'background',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  const handleChange = (html: string) => {
    setEditorHtml(html);
  };
  return (
    <ReactQuill ref={ref} value={editorHtml} onChange={handleChange} modules={modules} formats={formats} {...props} />
  );
});
TextEditor.displayName = 'TextEditor';

export default TextEditor;
