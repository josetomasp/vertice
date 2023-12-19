const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  transformIgnorePatterns: ['node_modules/(?!(jest-test|@ngrx))'],
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/projects/timeout//tsconfig.spec.json',
    },
  },
};
