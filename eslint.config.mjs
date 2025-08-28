import globals from 'globals';

import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// plugins
import react from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores(['node_modules/**', 'dist/**', 'build/**', '.idea/**', '.github/**', 'release/**']),
    {
        plugins: { react, prettier: eslintConfigPrettier, import: pluginImport },
        files: ['**/*.{js,jsx}'],
        settings: {
            react: { version: 'detect' },
        },
        extends: compat.extends('eslint:recommended', 'plugin:react/recommended', 'prettier'),

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
            },
        },

        rules: {
            semi: ['error', 'always'],
            'no-unused-vars': [
                'warn',
                {
                    varsIgnorePattern: '^ignored$',
                    argsIgnorePattern: '^ignored$',
                    caughtErrorsIgnorePattern: '^ignored$',
                },
            ],
            'no-empty': ['warn', { allowEmptyCatch: true }],
            'brace-style': ['warn', '1tbs'],
            // React 17+ features
            'react/jsx-uses-react': 'off',
            'react/jsx-key': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'import/named': 'error',
            'import/default': 'error',
            'import/no-named-as-default': 'warn',
        },
    },
]);
