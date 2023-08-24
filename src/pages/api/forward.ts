import { allowCors } from 'api/axios';
import { forward } from 'controllers';

export default allowCors(forward.handler);
