module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['vue','jsx'],
  extends: ["plugin:vue/essential",'eslint:recommended','prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    "parser": "@babel/eslint-parser",
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": false
    },
  },
}