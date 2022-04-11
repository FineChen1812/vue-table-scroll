module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['vue','jsx', "transform-vue-jsx"],
  extends: ["plugin:vue/essential",'eslint:recommended','prettier'],
  parserOptions: {
    "parser": "@babel/eslint-parser",
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    requireConfigFile: false
  },
}