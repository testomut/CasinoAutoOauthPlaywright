const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
    {
        ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'docs/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['e2e/**/*.ts'],
        ...playwright.configs['flat/recommended'],
    },
    prettier,
    {
        rules: {
            'playwright/expect-expect': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: { require: 'readonly', module: 'writable' },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
);
