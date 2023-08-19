module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules', '/.next'],
  setupFilesAfterEnv: ['./test/index.ts'],
  transform: {
    '^.+\\.{ts|tsx}?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsConfig: 'tsconfig.json',
      },
    ],
  },
};
