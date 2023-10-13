import { password } from 'controllers';
import { allowCors } from '../../../requests/api';

export default allowCors(password.verify.handler);
