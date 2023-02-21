module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules', '/.next'],
  setupFilesAfterEnv: ['./test/index.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
