module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Limita Jest al código fuente
  roots: ['<rootDir>/src'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
  },

  moduleFileExtensions: ['ts', 'js', 'json'],

  testMatch: ['**/*.spec.ts'],

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // Solo recolecta cobertura del código fuente (no tests, ni dist)
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.ts',
    '!src/main.ts',
  ],

  coverageDirectory: 'coverage',

  // Ignora node_modules y dist tanto en tests como en cobertura
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],

  transformIgnorePatterns: [
    '/node_modules/(?!(jose|@thallesp/nestjs-better-auth|@noble/ciphers|@noble/hashes)/.*)',
  ],
<<<<<<< HEAD
};
=======
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
>>>>>>> fb209b710c049a2cf2d1c906ba18b12527d53c4b
