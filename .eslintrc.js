module.exports = {
  'plugins': ['html', 'vue'],
  'extends': ['elemefe', 'plugin:vue/recommended', 'prettier'],
  'rules': {
    'no-restricted-globals': ['error', 'event', 'fdescribe']
  },
  'parserOptions': {
    'ecmaVersion': 6,
    'ecmaFeatures': {
      'jsx': true
    }
  }
};
