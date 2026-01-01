import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [{
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tsparser,
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    globals: globals.browser,
  },
  plugins: { '@typescript-eslint': tseslint },
  rules: {
    ...js.configs.recommended.rules,
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
}];
