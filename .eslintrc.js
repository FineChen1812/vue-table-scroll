module.exports = {
  "plugins": ["html"],
  "extends": ["elemefe", 'plugin:vue/recommended'],
  "rules": {
    "no-restricted-globals": ["error", "event", "fdescribe"]
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  }
}