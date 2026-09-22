import type { Linter } from 'eslint';
import javascript from './configs/javascript.ts';

export { files } from './configs/javascript.ts';

/** The default ESLint config for D&D Mapp projects. */
const config: Linter.Config[] = javascript;

export default config;
