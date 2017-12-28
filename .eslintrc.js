// https://eslint.org/docs/user-guide/configuring

module.exports = {
  enable: true,
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'prettier',
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {}
}
