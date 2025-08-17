import globals from "globals";

import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import path from "node:path";
import { fileURLToPath } from "node:url";

// plugins
import react from 'eslint-plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "node_modules/**",
    "dist/**",
    "build/**",
    ".idea/**",
    ".github/**",
    "release/**"
]), {
    plugins: { react },
    files: ["**/*.{js,jsx}"],
    settings: {
        react: { version: "detect" }
    },
    extends: compat.extends("eslint:recommended", "plugin:react/recommended"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parserOptions: {
            sourceType: "module",
            ecmaVersion: "latest",
            ecmaFeatures: { jsx: true }
        }
    },

    rules: {
        "semi": ["error", "always"],
        "no-unused-vars": ["warn", { varsIgnorePattern: "^ignored$", argsIgnorePattern: "^ignored$", caughtErrorsIgnorePattern: "^ignored$" }],
        "no-empty": ["warn", { allowEmptyCatch: true }],
        "brace-style": ["warn", "1tbs"],
        // React 17+ features
        "react/jsx-uses-react": "off",
        "react/jsx-key": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off"
    },
}]);
