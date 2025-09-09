// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
    ],
  },

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
    },
    rules: {
  // TypeScript
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-var-requires': 'off',

  // React
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react/display-name': 'off',
  'react/no-unescaped-entities': 'warn',
  'react/jsx-key': 'warn',
  'react/jsx-no-duplicate-props': 'warn',
  'react/jsx-no-undef': 'warn',
  'react/jsx-uses-vars': 'warn',

  // React Hooks
  'react-hooks/rules-of-hooks': 'warn',
  'react-hooks/exhaustive-deps': 'off',

  // Imports
  'import/order': 'off',
  'import/no-unresolved': 'off',
  'import/no-cycle': 'off',
  'import/no-unused-modules': 'off',

  // Core JS
  'no-console': 'off',
  'no-debugger': 'off',
  'no-duplicate-imports': 'warn',
  'no-unused-vars': 'off',
  'no-undef': 'off',
  'prefer-const': 'warn',
  'no-var': 'warn',
  'object-shorthand': 'warn',
  'prefer-template': 'warn',

  // Accessibility
  'jsx-a11y/alt-text': 'warn',

  // Prettier
  'prettier/prettier': 'off',
},

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
];
