import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import { rules, unusedVarsOptions } from '../rules.ts';

/** The file patterns that the config applies to. */
export const files = ['**/*.ts', '**/*.mts', '**/*.cts'];

/** The ESLint config for TypeScript files in D&D Mapp projects, with type-aware rules. */
const config: Linter.Config[] = defineConfig({
    name: '@dnd-mapp/config-eslint/typescript',
    files,
    extends: [
        js.configs.recommended,
        tseslint.configs.recommendedTypeChecked,
        tseslint.configs.stylisticTypeChecked,
        prettier,
    ],
    languageOptions: {
        parserOptions: {
            projectService: true,
        },
    },
    linterOptions: {
        reportUnusedDisableDirectives: 'error',
    },
    rules: {
        ...rules,
        '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
    },
});

export default config;
