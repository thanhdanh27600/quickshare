import path from 'path';
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env.test.local'),
});

jest.setTimeout(60000);
