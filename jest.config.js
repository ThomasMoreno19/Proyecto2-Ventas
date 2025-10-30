// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Limita Jest al código fuente en src/
  roots: ['<rootDir>/src'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
  },


  moduleFileExtensions: ['ts', 'js', 'json'],

  // Ajusta testMatch para buscar archivos .spec.ts en subdirectorios de src
  testMatch: ['**/*.spec.ts'],


  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Solo recolecta cobertura del código fuente (no tests, ni dist)
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*spec.ts',
    '!src/main.ts',
  ],

  coverageDirectory: 'coverage',

  // Ignora node_modules y dist tanto en tests como en cobertura
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],


  // Ignora node_modules y dist tanto en tests como en cobertura
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@thallesp/nestjs-better-auth|@noble/ciphers|@noble/hashes)/.*)',
  ],
};
