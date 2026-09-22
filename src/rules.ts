import type { Linter } from 'eslint';

/** The options for the unused variables rule, shared by the core rule and the typescript-eslint rule. */
export const unusedVarsOptions = { argsIgnorePattern: '^_', ignoreRestSiblings: true };

/** The core rules that every config of this package enforces on top of the recommended rules. */
export const rules: Linter.RulesRecord = {
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
};
