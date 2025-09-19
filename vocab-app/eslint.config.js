const next = require('eslint-config-next');

module.exports = [
  {
    ignores: [
      'node_modules',
      '.next',
      'out',
      'dist',
      '*.config.js',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
    extends: [
      ...next(),
      'plugin:@typescript-eslint/recommended',
    ],
  },
];
