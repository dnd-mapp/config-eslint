import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';
import config from './javascript.ts';

const linter = new Linter();

function lint(code: string, filename = 'file.js') {
    return linter.verify(code, config, { filename });
}

function ruleIds(code: string, filename?: string) {
    return lint(code, filename).map((message) => message.ruleId);
}

describe('javascript config', () => {
    it('accepts clean code', () => {
        expect(lint('export const answer = 42;\n')).toEqual([]);
    });

    it('reports the recommended rules', () => {
        expect(ruleIds('const value = undefinedVariable;\n')).toContain('no-undef');
        expect(ruleIds('const unused = 1;\n')).toContain('no-unused-vars');
    });

    it('reports a comparison that is not strict', () => {
        expect(ruleIds('export const same = (a, b) => a == b;\n')).toContain('eqeqeq');
    });

    it('reports a block without braces', () => {
        expect(ruleIds('export function run(flag) {\n    if (flag) return 1;\n    return 2;\n}\n')).toContain('curly');
    });

    it('reports var declarations and reassignable constants', () => {
        expect(ruleIds('var count = 1;\nexport { count };\n')).toContain('no-var');
        expect(ruleIds('let count = 1;\nexport { count };\n')).toContain('prefer-const');
    });

    it('reports string concatenation, long-hand properties, and function callbacks', () => {
        expect(ruleIds("export const greet = (name) => 'Hi ' + name;\n")).toContain('prefer-template');
        expect(ruleIds('const name = 1;\nexport const user = { name: name };\n')).toContain('object-shorthand');
        expect(ruleIds('export const run = (list) => list.map(function (item) { return item; });\n')).toContain(
            'prefer-arrow-callback',
        );
    });

    it('ignores unused arguments that start with an underscore', () => {
        expect(ruleIds('export const first = (value, _second) => value;\n')).toEqual([]);
        expect(ruleIds('export const first = (value, second) => value;\n')).toContain('no-unused-vars');
    });

    it('ignores siblings of a rest property', () => {
        expect(ruleIds('export const omit = ({ omitted, ...rest }) => rest;\n')).toEqual([]);
    });

    it('leaves formatting to Prettier', () => {
        expect(lint('export const answer = 42\nexport const greeting = "hi"\n')).toEqual([]);
    });

    it('reports an unused disable directive', () => {
        const [message] = lint('// eslint-disable-next-line no-var\nexport const answer = 42;\n');
        expect(message?.message).toContain('Unused eslint-disable directive');
    });

    it('applies to every JavaScript file extension', () => {
        expect(ruleIds('var count = 1;\n', 'file.mjs')).toContain('no-var');
        expect(ruleIds('var count = 1;\n', 'file.cjs')).toContain('no-var');
    });

    it('does not apply to other file types', () => {
        expect(ruleIds('var count = 1;\n', 'file.ts')).not.toContain('no-var');
    });
});
