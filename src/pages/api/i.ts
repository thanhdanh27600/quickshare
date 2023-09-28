import { i } from 'controllers';
import { allowCors } from 'requests/api';
// i = image
export default allowCors(i.handler);
