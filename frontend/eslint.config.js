// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-use-before-define': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    ignores: ['src/dsnpLink.ts', 'build/**'],
  },
  {
    // enable jest rules on test files
    files: ['**/*.test.ts', '**/*.spec.ts'],
    ...jestPlugin.configs['flat/recommended'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
