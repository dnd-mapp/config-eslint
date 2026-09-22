# @dnd-mapp/config-eslint

[![push main](https://github.com/dnd-mapp/config-eslint/actions/workflows/push-main.yaml/badge.svg?branch=main)](https://github.com/dnd-mapp/config-eslint/actions/workflows/push-main.yaml)
[![npm version](https://img.shields.io/npm/v/@dnd-mapp/config-eslint)](https://www.npmjs.com/package/@dnd-mapp/config-eslint)
[![license](https://img.shields.io/npm/l/@dnd-mapp/config-eslint)](LICENSE)

Shared ESLint configs for all D&D Mapp projects, for JavaScript and TypeScript files. They are [flat configs](https://eslint.org/docs/latest/use/configure/configuration-files) for ESLint 10. The TypeScript config uses type information.

## Requirements

- ESLint 10 is a peer dependency and must be installed in your project.
- TypeScript 6 is an optional peer dependency. Install it to use the `typescript` config, and give your project a `tsconfig.json` that includes the linted files.
- Node.js 24.21 or a later 24.x release, matching the `engines` field.

## Installation

```bash
pnpm add --save-dev eslint @dnd-mapp/config-eslint
```

For the `typescript` config, install TypeScript as well.

```bash
pnpm add --save-dev eslint typescript @dnd-mapp/config-eslint
```

## Usage

Re-export the config from an `eslint.config.js` file in your project root.

```js
export { default } from '@dnd-mapp/config-eslint';
```

To combine configs or add your own rules, pass them to `defineConfig` together with your own config objects. Objects that come later override the ones before them.

```js
import javascript from '@dnd-mapp/config-eslint/javascript';
import typescript from '@dnd-mapp/config-eslint/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist/']),
    javascript,
    typescript,
    {
        files: ['**/*.js', '**/*.ts'],
        rules: {
            'no-console': 'error',
        },
    },
]);
```

Every config ships with type declarations. Each one is typed as an array of ESLint `Linter.Config` objects, so it works in an `eslint.config.ts` file.

## Available configs

| Config       | Import path                          | Description                                    |
|:-------------|:-------------------------------------|:-----------------------------------------------|
| `javascript` | `@dnd-mapp/config-eslint/javascript` | The config for `.js`, `.mjs`, and `.cjs` files |
| `typescript` | `@dnd-mapp/config-eslint/typescript` | The config for `.ts`, `.mts`, and `.cts` files |

The package root, `@dnd-mapp/config-eslint`, resolves to `javascript`.

Each config only applies to its own file types and does not touch the others. Each module also exports its patterns as `files`, so you can target the same files in your own config objects.

## Shared rules

Every config includes the `recommended` config of [`@eslint/js`](https://github.com/eslint/eslint/tree/main/packages/js), which enables the rules that catch likely bugs. Every config also includes [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), which turns off the rules that conflict with Prettier. Formatting stays the job of Prettier.

On top of that, every config enforces modern JavaScript with these rules.

| Rule                    | Setting                                               | Reason                                              |
|:------------------------|:------------------------------------------------------|:----------------------------------------------------|
| `curly`                 | `'all'`                                               | Requires braces around every block                  |
| `eqeqeq`                | `'always'`                                            | Requires `===` and `!==`                            |
| `no-unused-vars`        | `argsIgnorePattern: '^_'`, `ignoreRestSiblings: true` | Allows unused `_` arguments and rest siblings       |
| `no-var`                | `'error'`                                             | Requires `let` or `const` instead of `var`          |
| `object-shorthand`      | `'always'`                                            | Requires shorthand properties and methods           |
| `prefer-arrow-callback` | `'error'`                                             | Requires arrow functions as callbacks               |
| `prefer-const`          | `'error'`                                             | Requires `const` when a binding is never reassigned |
| `prefer-template`       | `'error'`                                             | Requires template literals instead of concatenation |

Every config also reports unused `eslint-disable` comments as errors through `linterOptions.reportUnusedDisableDirectives`.

`@eslint/js`, `eslint-config-prettier`, and `typescript-eslint` are dependencies of this package, so you do not install them.

## What `javascript` sets

The config applies to files that match `**/*.js`, `**/*.mjs`, and `**/*.cjs`. It is built from the shared layers above, in this order: the recommended rules, the Prettier overrides, and then the shared rules.

### Globals

The config does not declare any globals, because they depend on where your code runs. Add them in your own config with the [`globals`](https://github.com/sindresorhus/globals) package. Without them, `no-undef` reports names such as `process` or `window`.

```bash
pnpm add --save-dev globals
```

```js
import javascript from '@dnd-mapp/config-eslint';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    javascript,
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
]);
```

## What `typescript` sets

The config applies to files that match `**/*.ts`, `**/*.mts`, and `**/*.cts`. It uses type information, so its rules can reason about the types in your code. It is built from these layers, in this order.

1. The `recommended` config of `@eslint/js`.
2. The [`recommended-type-checked`](https://typescript-eslint.io/users/configs#recommended-type-checked) config of [typescript-eslint](https://typescript-eslint.io/). It sets up the TypeScript parser and enables the rules that catch likely bugs, such as `no-floating-promises` and `no-unsafe-assignment`. It also turns off the core rules that the TypeScript compiler already checks, such as `no-undef`.
3. The [`stylistic-type-checked`](https://typescript-eslint.io/users/configs#stylistic-type-checked) config of typescript-eslint. It enforces consistent TypeScript syntax, such as `interface` over `type` for object types, `string[]` over `Array<string>`, and `??` over `||` for nullable values.
4. The Prettier overrides.
5. The shared rules, with `@typescript-eslint/no-unused-vars` in place of the core `no-unused-vars` rule, using the same options.

### Type information

The config enables the [project service](https://typescript-eslint.io/packages/parser#projectservice) of typescript-eslint through `parserOptions.projectService`. The service finds the nearest `tsconfig.json` for every linted file and builds a TypeScript program from it, so the type-aware rules know the types in your code.

This has two consequences for your project.

- Every linted TypeScript file must be included by a `tsconfig.json`. ESLint reports a parsing error for a file that no `tsconfig.json` includes. Either include the file, or ignore it with `globalIgnores`.
- The service resolves `tsconfig.json` files relative to the directory that you run ESLint from. Set `parserOptions.tsconfigRootDir` in your own config to make that independent of the working directory.

```js
import typescript from '@dnd-mapp/config-eslint/typescript';
import { defineConfig } from 'eslint/config';

export default defineConfig([
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
```

Type-aware linting is slower than linting without type information, because it type checks your project. Run the type-aware rules in CI and in your editor as usual, and expect a first run to take a few seconds on a large project.

The TypeScript compiler is a peer dependency of typescript-eslint, so install `typescript` in your project to use this config.

## Changelog

Notable changes for consumers of this package are listed in the [changelog](CHANGELOG.md).

## Contributing

Contributions are welcome. See the [contributing guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © D&D Mapp
