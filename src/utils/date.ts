import dayjs from 'dayjs';
import 'dayjs/locale/vi';

export const DATE_FULL_FORMAT = 'LLL';

const localizedFormat = require('dayjs/plugin/localizedFormat');
let date = dayjs;
date.extend(localizedFormat);
export default date;
