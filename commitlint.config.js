module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
     2, 'always',
     ['udp', 'feat', 'fix', 'docs']
    ]
  }
}