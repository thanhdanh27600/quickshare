import { allowCors } from 'api/axios';
import { cache } from 'controllers';
export default allowCors(cache.handler);
