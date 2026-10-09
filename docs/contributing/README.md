# Contributing to dnd-mapp/config-eslint

This page adds the details of `dnd-mapp/config-eslint` to the [shared contributing guide](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md). Read that guide first.

This package is the shared ESLint config for all D&D Mapp projects. A change here affects every project that uses it, so keep changes small and deliberate.

## Changing or adding a config

Configs are written in TypeScript and live in `src/configs/*.ts`. Import other files with the `.ts` extension, because the compiler rewrites it to `.js`. The `exports` map in `package.json` lists each config under its name without the extension, so add an entry there when you add a config. The package entry point, `src/index.ts`, exports the default config, which is `javascript`.

Build every config with `defineConfig` from `eslint/config` and give it a `name`, so it shows up in the ESLint config inspector. Set `files` on every config object, so a config only applies to the file types it is written for.

Put shared configs such as `@eslint/js` and `eslint-config-prettier` in `extends`, and put the rules of this package in `rules`. The rules of a config object win over the configs in `extends`, so a rule that `eslint-config-prettier` turns off, such as `curly`, can be turned back on there. Only do that with an option that does not conflict with Prettier.

The rules that every config enforces live in `src/rules.ts`. Spread them into the `rules` of each config, so a change reaches every config. When a plugin replaces a core rule with its own version, such as `@typescript-eslint/no-unused-vars`, the config enables the plugin rule with the shared options instead of the core rule.

Keep every config free of options that depend on the project or the environment, such as globals or `tsconfigRootDir`. Consumers add those in their own ESLint configuration.

Shared configs that a config extends are dependencies, so consumers do not install them. ESLint is a peer dependency, and TypeScript is an optional peer dependency for the `typescript` config. Raise their ranges when you use a rule or an option that older versions do not know.

The `build` script compiles the sources to JavaScript and type declarations in `dist`. The `prepublishOnly` script runs it, and then runs `prepare-dist` from `@dnd-mapp/package-builder`. That command writes the trimmed `package.json`, copies the files listed in `.prepare-distrc.json`, and checks the `exports`. Run `pnpm run typecheck` to type check the sources without emitting anything.

When you add or change a rule, update the README in the same pull request.

- Update the "Available configs" table when you add a config.
- Update the "Shared rules" section when you change the rules in `src/rules.ts`.
- Update the "What `javascript` sets" or "What `typescript` sets" section when you change the layers of that config.

## Building and testing

Tests use Vitest and lint small code samples. The `javascript` tests use the `Linter` class of ESLint. The `typescript` tests need type information, so they write each sample into a temporary project with a `tsconfig.json` and lint it with the `ESLint` class. Add a test for every rule that you add or change. Coverage must stay above the thresholds in `vitest.config.ts`. Use `pnpm test` to run the tests in watch mode with the Vitest UI.

The repository lints itself with the configs it publishes. The `eslint.config.ts` file in the root imports the `javascript` and `typescript` configs from `src`, so every source and script file is checked by the rules that consumers get. ESLint 10 loads the TypeScript config file through the type stripping of Node.js, so no extra loader is needed.

## Checks

On top of the [shared checks](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md#checks), CI runs `lint-ts`, `typecheck`, `build`, and `test-ci`. Run them yourself before you open a pull request.

```bash
pnpm run lint-ts
pnpm run typecheck
pnpm run build
pnpm run test-ci
```

The `lint-ts` script lints the code with ESLint.

## Changelog and versioning

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Record every notable change for consumers under `[Unreleased]` in `CHANGELOG.md`, using the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

Enabling a rule or making a rule stricter can make code that passed before fail in consumer projects. Treat it as a breaking change and say so in the changelog entry.

## Releasing

1. Run the [prepare release workflow](../../.github/workflows/prepare-release.yaml) on `main` with the part of the version to bump, for example `gh workflow run prepare-release.yaml -f bump=minor`. It opens the `chore: release X.Y.Z` pull request with auto-merge on.
2. Review and approve the pull request. Once it merges, the `tag` job of the [push workflow](../../.github/workflows/push-main.yaml) creates the annotated tag `vX.Y.Z` on the merge commit.
3. The [release workflow](../../.github/workflows/release.yaml) runs the CI checks, verifies the tag and the changelog, stages the package on npm, and creates the GitHub Release, which opens a discussion in the Announcements category.
4. Find the staged version with `pnpm stage list` and approve it with `pnpm stage approve <id>` and 2FA.

If the staged version is wrong, reject it with `pnpm stage reject <id>`. The same version cannot be staged again until then.
