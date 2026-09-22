# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `javascript` config, available as `@dnd-mapp/config-eslint` and `@dnd-mapp/config-eslint/javascript`. It applies to `.js`, `.mjs`, and `.cjs` files, extends the `recommended` config of `@eslint/js` and `eslint-config-prettier`, and enforces modern JavaScript with `curly`, `eqeqeq`, `no-var`, `object-shorthand`, `prefer-arrow-callback`, `prefer-const`, and `prefer-template`.
- Type declarations for the config. It is typed as an array of ESLint `Linter.Config` objects.
- ESLint 10 as a peer dependency. `@eslint/js` and `eslint-config-prettier` are regular dependencies, so consumers do not install them.

[Unreleased]: https://github.com/dnd-mapp/config-eslint/commits/main
