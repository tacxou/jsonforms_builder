module.exports = {
  root: true,
  env: {
    node: true,
    'jest/globals': true,
  },

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'jest'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.cjs'],

  rules: {
    'no-console': 0,
    'import/named': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'no-extra-parens': 2, // https: //eslint.org/docs/rules/no-extra-parens
    'curly': 2, // https: //eslint.org/docs/rules/curly
    'eqeqeq': 2, // https: //eslint.org/docs/rules/eqeqeq
    'indent': ['error', 2],
    'camelcase': 'off',
    'no-empty': 'off',
    'padded-blocks': 'off',
    'import/first': 'off',

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
}
