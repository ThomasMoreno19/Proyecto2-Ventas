module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', 
    '^@common/(.*)$': '<rootDir>/src/common/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: '**/*.spec.ts',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
  'src/**/*.ts',
  '!src/main.ts',
  '!src/**/*.module.ts',
  ],
  coverageDirectory: 'coverage',
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@thallesp/nestjs-better-auth|@noble/ciphers|@noble/hashes)/.*)',
  ],
};