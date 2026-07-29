import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // Keep Prettier the source of truth for formatting; disable ESLint rules
  // that would conflict with it.
  prettier,
  {
    rules: {
      // Always require braces, even for single-statement bodies. Re-enabled
      // after eslint-config-prettier (which disables curly): the 'all' option
      // only ever adds braces, so it never conflicts with Prettier.
      curly: ['error', 'all'],
    },
  },
);
