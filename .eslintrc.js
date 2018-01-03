module.exports = {
  extends: ['eslint:recommended'],
  globals: {
    fixture: true,
    chrome: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    es6: true,
    browser: true,
    jest: true,
    jquery: true,
    node: true
  },
  rules: {
    'comma-dangle': [1, 'always-multiline']
  }
};
