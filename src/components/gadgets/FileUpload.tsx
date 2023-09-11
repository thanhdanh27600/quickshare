import { API } from 'api/axios';
import { ChangeEventHandler, useState } from 'react';
import HttpStatusCode from 'utils/statusCode';

export function FileUpload() {
  const [file, setFile] = useState<any>();
  const [status, setStatus] = useState('');

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files) {
      setStatus('Please select a file to upload.');
      return;
    }

    const selectedFile = e.target.files[0];
    const fileData = new Blob([selectedFile]);
    const rs = await new Promise(getBuffer);

    function getBuffer(resolve: any) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(fileData);
      reader.onload = function () {
        var arrayBuffer = reader.result as any;
        var bytes = new Uint8Array(arrayBuffer);
        resolve(bytes);
      };
    }
    setFile(rs);
  };

  const handleUpload = () => {
    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    API.post('/api/upload', { file })
      .then((response) => {
        console.log('response', response);
        if (response.status === HttpStatusCode.OK) {
          setStatus('File uploaded successfully');
        } else {
          setStatus('Upload failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setStatus('Error occurred during upload.');
      });
  };

  return (
    <div>
      <h1>File Upload Example</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div id="status">{status}</div>
    </div>
  );
}
