module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ["plugin:vue/essential",'eslint:recommended'],
  parserOptions: {
    parser: "babel-eslint",
  },
}