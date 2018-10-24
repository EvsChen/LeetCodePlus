module.exports = {
  extends: ['eslint:recommended', 'google'],
  env: {
    serviceworker: true,
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  globals: {
    chrome: false,
    workbox: false,
    WorkboxSW: false,
    SyncEvent: false,
    BroadcastChannel: false,
    Comlink: false,
  },
  parser: 'babel-eslint',
  rules: {
    "require-jsdoc": ["error", {
      "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": false,
          "ClassDeclaration": false,
          "ArrowFunctionExpression": false,
          "FunctionExpression": false
      }
    }]
  }
};
