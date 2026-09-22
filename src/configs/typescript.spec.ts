import { ESLint } from 'eslint';
import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import config from './typescript.ts';

let directory: string;
let eslint: ESLint;

beforeAll(async () => {
    directory = await realpath(await mkdtemp(join(tmpdir(), 'config-eslint-')));
    const tsconfig = {
        compilerOptions: { module: 'nodenext', strict: true, target: 'es2024', types: [] },
        include: ['**/*.ts', '**/*.mts', '**/*.cts'],
    };
    await writeFile(join(directory, 'tsconfig.json'), JSON.stringify(tsconfig));
    eslint = new ESLint({ cwd: directory, overrideConfig: config, overrideConfigFile: true });
});

afterAll(async () => {
    await rm(directory, { force: true, recursive: true });
});

async function lint(code: string, filename = 'file.ts') {
    const path = join(directory, filename);
    await writeFile(path, code);
    const [result] = await eslint.lintText(code, { filePath: path });
    return result?.messages ?? [];
}

async function ruleIds(code: string, filename?: string) {
    return (await lint(code, filename)).map((message) => message.ruleId);
}

describe('typescript config', () => {
    it('accepts clean code', async () => {
        expect(await lint('export const answer = 42;\nexport interface User {\n    name: string;\n}\n')).toEqual([]);
    });

    it('parses TypeScript syntax', async () => {
        expect(await lint('export type Id = string | number;\nexport const id: Id = 1;\n')).toEqual([]);
    });

    it('reports the recommended typescript-eslint rules', async () => {
        expect(await ruleIds('export const value: any = 1;\n')).toContain('@typescript-eslint/no-explicit-any');
        expect(await ruleIds('export const fs = require("node:fs");\n')).toContain(
            '@typescript-eslint/no-require-imports',
        );
    });

    it('reports the type-aware recommended rules', async () => {
        expect(await ruleIds('export const run = () => {\n    Promise.resolve(1);\n};\n')).toContain(
            '@typescript-eslint/no-floating-promises',
        );
        expect(await ruleIds('const value: number = 1;\nexport const count = value as number;\n')).toContain(
            '@typescript-eslint/no-unnecessary-type-assertion',
        );
    });

    it('reports the stylistic typescript-eslint rules', async () => {
        expect(await ruleIds('export type User = { name: string };\n')).toContain(
            '@typescript-eslint/consistent-type-definitions',
        );
        expect(await ruleIds('export const names: Array<string> = [];\n')).toContain('@typescript-eslint/array-type');
        expect(await ruleIds('export const count: number = 1;\n')).toContain('@typescript-eslint/no-inferrable-types');
    });

    it('reports the type-aware stylistic rules', async () => {
        expect(await ruleIds("export const pick = (value: string | null) => value || 'fallback';\n")).toContain(
            '@typescript-eslint/prefer-nullish-coalescing',
        );
        expect(await ruleIds('export const has = (list: string[]) => list.indexOf("a") !== -1;\n')).toContain(
            '@typescript-eslint/prefer-includes',
        );
    });

    it('uses the typescript-eslint rule for unused variables', async () => {
        const ids = await ruleIds('const unused = 1;\n');
        expect(ids).toContain('@typescript-eslint/no-unused-vars');
        expect(ids).not.toContain('no-unused-vars');
    });

    it('ignores unused arguments that start with an underscore', async () => {
        expect(await ruleIds('export const first = (value: number, _second: number) => value;\n')).toEqual([]);
        expect(await ruleIds('export const first = (value: number, second: number) => value;\n')).toContain(
            '@typescript-eslint/no-unused-vars',
        );
    });

    it('ignores siblings of a rest property', async () => {
        expect(await ruleIds('export const omit = ({ omitted, ...rest }: Record<string, number>) => rest;\n')).toEqual(
            [],
        );
    });

    it('leaves the core rules that TypeScript checks to the compiler', async () => {
        expect(await ruleIds('export const value = undefinedVariable;\n')).not.toContain('no-undef');
    });

    it('reports the shared rules', async () => {
        expect(await ruleIds('export const same = (a: number, b: number) => a == b;\n')).toContain('eqeqeq');
        expect(
            await ruleIds('export function run(flag: boolean) {\n    if (flag) return 1;\n    return 2;\n}\n'),
        ).toContain('curly');
        expect(await ruleIds('var count = 1;\nexport { count };\n')).toContain('no-var');
        expect(await ruleIds("export const greet = (name: string) => 'Hi ' + name;\n")).toContain('prefer-template');
    });

    it('leaves formatting to Prettier', async () => {
        expect(await lint('export const answer = 42\nexport const greeting = "hi"\n')).toEqual([]);
    });

    it('reports an unused disable directive', async () => {
        const [message] = await lint('// eslint-disable-next-line no-var\nexport const answer = 42;\n');
        expect(message?.message).toContain('Unused eslint-disable directive');
    });

    it('applies to every TypeScript file extension', async () => {
        expect(await ruleIds('var count = 1;\nexport { count };\n', 'file.mts')).toContain('no-var');
        expect(await ruleIds('var count = 1;\nexport { count };\n', 'file.cts')).toContain('no-var');
    });

    it('does not apply to other file types', async () => {
        expect(await ruleIds('var count = 1;\n', 'file.js')).not.toContain('no-var');
    });
});
