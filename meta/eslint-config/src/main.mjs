import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import importSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/build/**'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { 'import-sort': importSort },
    rules: {
      'import-sort/imports': 'error',
      'import-sort/exports': 'error',
    },
  },
  prettier,
);
