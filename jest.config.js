module.exports = {
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  modulePaths: ['<rootDir>'],
  globalSetup: 'jest-preset-angular/global-setup',
  moduleNameMapper: {
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@modules/(.*)$': '<rootDir>/src/app/modules/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@shared$': '<rootDir>/src/app/shared/index.ts',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**'],
  reporters: ['default',  ['jest-sonar', {
		outputDirectory: 'coverage',
		outputName: 'coverage.xml',
		reportedFilePath: 'absolute'
  }]],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs']
};
