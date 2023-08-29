import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

jest.setTimeout(20000);
