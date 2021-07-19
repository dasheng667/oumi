module.exports = {
  extends: [require.resolve('./scripts/eslint.js')],
  rules: {
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-unused-vars': ['off']
  },
  globals: {
    page: true
  }
};
