import { defineConfig, globalIgnores } from 'eslint/config';
import javascript from './src/configs/javascript.ts';
import typescript from './src/configs/typescript.ts';

export default defineConfig([
    globalIgnores(['dist/', '.coverage/', '.vitest/', '.tmp/']),
    javascript,
    typescript,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);
