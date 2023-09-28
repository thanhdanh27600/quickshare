import { forward } from 'controllers';
import { allowCors } from 'requests/api';

export default allowCors(forward.handler);
