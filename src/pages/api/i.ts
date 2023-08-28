import { allowCors } from 'api/axios';
import { i } from 'controllers';
// i = image
export default allowCors(i.handler);
