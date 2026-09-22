import { describe, expect, it } from 'vitest';
import javascript from './configs/javascript.ts';
import config from './index.ts';

describe('default config', () => {
    it('is the javascript config', () => {
        expect(config).toBe(javascript);
    });
});
