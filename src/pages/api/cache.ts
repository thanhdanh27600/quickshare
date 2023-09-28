import { cache } from 'controllers';
import { allowCors } from 'requests/api';
export default allowCors(cache.handler);
