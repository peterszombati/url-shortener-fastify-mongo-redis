import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
      promise,
      'unused-imports': unusedImports,
    },
    rules: {
      //'no-console': 'warn',
      'no-debugger': 'warn',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'promise/always-return': 'warn',
      'promise/no-return-wrap': 'error',
      'promise/catch-or-return': 'warn',
      'promise/no-nesting': 'warn',
      'prettier/prettier': 'error',
    },
  },
]);
