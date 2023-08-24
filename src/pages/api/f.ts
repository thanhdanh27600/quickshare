import { allowCors } from 'api/axios';
import { f } from 'controllers';
// f = forward
export default allowCors(f.handler);
