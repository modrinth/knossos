module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    node: true,
    jest: true
  },
  plugins: [
    'jest',
    'vue'
  ],
  globals: {
    'jest/globals': true,
    jasmine: true
  }
}
