# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `javascript` config, available as `@dnd-mapp/config-eslint` and `@dnd-mapp/config-eslint/javascript`. It applies to `.js`, `.mjs`, and `.cjs` files, extends the `recommended` config of `@eslint/js` and `eslint-config-prettier`, and enforces modern JavaScript with `curly`, `eqeqeq`, `no-var`, `object-shorthand`, `prefer-arrow-callback`, `prefer-const`, and `prefer-template`.
- `typescript` config, available as `@dnd-mapp/config-eslint/typescript`. It applies to `.ts`, `.mts`, and `.cts` files and adds the `recommended-type-checked` and `stylistic-type-checked` configs of typescript-eslint to the layers of `javascript`. It enables the project service for type information and uses `@typescript-eslint/no-unused-vars` in place of the core rule.
- Type declarations for every config. Each one is typed as an array of ESLint `Linter.Config` objects.
- ESLint 10 as a peer dependency and TypeScript 6 as an optional peer dependency. `@eslint/js`, `eslint-config-prettier`, and `typescript-eslint` are regular dependencies, so consumers do not install them.

[Unreleased]: https://github.com/dnd-mapp/config-eslint/commits/main
