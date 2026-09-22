# @dnd-mapp/config-eslint

[![push main](https://github.com/dnd-mapp/config-eslint/actions/workflows/push-main.yaml/badge.svg?branch=main)](https://github.com/dnd-mapp/config-eslint/actions/workflows/push-main.yaml)
[![npm version](https://img.shields.io/npm/v/@dnd-mapp/config-eslint)](https://www.npmjs.com/package/@dnd-mapp/config-eslint)
[![license](https://img.shields.io/npm/l/@dnd-mapp/config-eslint)](LICENSE)

Shared ESLint config for all D&D Mapp projects. It is a [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) for ESLint 10.

## Requirements

- ESLint 10 is a peer dependency and must be installed in your project.
- Node.js 24.21 or a later 24.x release, matching the `engines` field.

## Installation

```bash
pnpm add --save-dev eslint @dnd-mapp/config-eslint
```

## Usage

Re-export the config from an `eslint.config.js` file in your project root.

```js
export { default } from '@dnd-mapp/config-eslint';
```

To add your own rules, pass the config to `defineConfig` together with your own config objects. Objects that come later override the ones before them.

```js
import javascript from '@dnd-mapp/config-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist/']),
    javascript,
    {
        files: ['**/*.js'],
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

The package root, `@dnd-mapp/config-eslint`, resolves to `javascript`.

## What `javascript` sets

The config applies to files that match `**/*.js`, `**/*.mjs`, and `**/*.cjs`. It does not touch other file types. The module also exports these patterns as `files`, so you can target the same files in your own config objects.

It is built from three layers, in this order.

1. The `recommended` config of [`@eslint/js`](https://github.com/eslint/eslint/tree/main/packages/js), which enables the rules that catch likely bugs.
2. [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier), which turns off every rule that conflicts with Prettier. Formatting stays the job of Prettier.
3. The rules below, which enforce modern JavaScript on top of the recommended set.

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

The config also reports unused `eslint-disable` comments as errors through `linterOptions.reportUnusedDisableDirectives`.

`@eslint/js` and `eslint-config-prettier` are dependencies of this package, so you do not install them.

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

## Changelog

Notable changes for consumers of this package are listed in the [changelog](CHANGELOG.md).

## Contributing

Contributions are welcome. See the [contributing guide](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) © D&D Mapp
