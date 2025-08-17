import globals from "globals";

import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import path from "node:path";
import { fileURLToPath } from "node:url";

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
    extends: compat.extends("eslint:recommended", "plugin:react/recommended"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    rules: {
        semi: ["error", "always"],
        "brace-style": ["error", "1tbs"],
    },
}]);