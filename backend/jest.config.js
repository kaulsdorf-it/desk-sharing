module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(j|t)s?$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/(tests/integration/**/*.spec.(ts)|tests/unit/**/*.spec.(ts)|**/__tests__/*.(ts))'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: ['<rootDir>/tests'],
  coverageDirectory: '<rootDir>/tests/coverage',
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
}
