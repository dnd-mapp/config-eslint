import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import { rules, unusedVarsOptions } from '../rules.ts';

/** The file patterns that the config applies to. */
export const files = ['**/*.js', '**/*.mjs', '**/*.cjs'];

/** The ESLint config for JavaScript files in D&D Mapp projects. */
const config: Linter.Config[] = defineConfig({
    name: '@dnd-mapp/config-eslint/javascript',
    files,
    extends: [js.configs.recommended, prettier],
    linterOptions: {
        reportUnusedDisableDirectives: 'error',
    },
    rules: {
        ...rules,
        'no-unused-vars': ['error', unusedVarsOptions],
    },
});

export default config;
