module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue'
  ],

  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  snapshotSerializers: [
    'jest-serializer-vue'
  ],

  testMatch: [
    '<rootDir>/(tests/unit/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx))'
  ],

  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  setupFiles: ['<rootDir>/tests/unit/index'],
  preset: '@vue/cli-plugin-unit-jest'
}