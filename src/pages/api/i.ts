import { allowCors } from 'api/axios';
import { i } from 'controllers';
// i = mage
export default allowCors(i.handler);
