# Contributing

Thank you for your interest in contributing to `@dnd-mapp/config-eslint`.

This package is the shared ESLint config for all D&D Mapp projects. A change here affects every project that uses it, so please keep changes small and deliberate.

## Before you start

Open an [issue](https://github.com/dnd-mapp/config-eslint/issues) to discuss any change beyond a typo fix before you send a pull request. This avoids work on changes that do not fit the goals of the package.

## Development setup

The required tool versions are enforced through `devEngines` and `engineStrict`, so installing with other versions fails.

- Node `24.21.0`
- pnpm `12.5.1`

Install the dependencies with:

```bash
pnpm install
```

Dependency versions live in the catalogs in `pnpm-workspace.yaml`, which uses `catalogMode: strict`. Add or bump versions there and reference them in `package.json`. Use `catalog:` for the default catalog and a named catalog such as `catalog:eslint` for a group of tools.

Newly published releases are held back for three days through `minimumReleaseAge`. You may need to wait before you can bump to a very recent version.

## Git hooks

[Lefthook](https://lefthook.dev/) installs the Git hooks when you run `pnpm install`. The hooks are defined in `lefthook.yaml`.

| Hook         | Runs                                           | On                        |
|:-------------|:-----------------------------------------------|:--------------------------|
| `pre-commit` | Prettier, markdownlint-cli2, and ESLint checks | The staged files          |
| `commit-msg` | commitlint                                     | The message of the commit |

The pre-commit hooks only check files. Run `pnpm run format` to fix formatting issues, and `pnpm exec eslint --fix` to apply the fixes that ESLint can make. Stage the result.

## Changing or adding a config

Configs are written in TypeScript and live in `src/configs/*.ts`. Import other files with the `.ts` extension, because the compiler rewrites it to `.js`. The `exports` map in `package.json` exposes each config without the extension. The package entry point, `src/index.ts`, exports the default config, which is `javascript`.

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

Tests use Vitest and lint small code samples. The `javascript` tests use the `Linter` class of ESLint. The `typescript` tests need type information, so they write each sample into a temporary project with a `tsconfig.json` and lint it with the `ESLint` class. Add a test for every rule that you add or change. Coverage must stay above the thresholds in `vitest.config.ts`.

The repository lints itself with the configs it publishes. The `eslint.config.ts` file in the root imports the `javascript` and `typescript` configs from `src`, so every source and script file is checked by the rules that consumers get. ESLint 10 loads the TypeScript config file through the type stripping of Node.js, so no extra loader is needed.

Check and format the repository with these commands. CI runs `format-check`, `lint-md`, `lint-ts`, `typecheck`, `build`, and `test-ci`. Run them yourself before you open a pull request.

```bash
pnpm run format-check
pnpm run format
pnpm run lint-md
pnpm run lint-ts
pnpm run typecheck
pnpm run build
pnpm run test-ci
```

The `lint-md` script lints the Markdown files with markdownlint, and the `lint-ts` script lints the code with ESLint. Use `pnpm test` to run the tests in watch mode with the Vitest UI.

## Changelog and versioning

This project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Record every notable change for consumers under `[Unreleased]` in `CHANGELOG.md`, using the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.

Enabling a rule or making a rule stricter can make code that passed before fail in consumer projects. Treat it as a breaking change and say so in the changelog entry.

## Code style

Follow the rules in `.editorconfig`.

- Use UTF-8 and LF line endings.
- Indent with 4 spaces, or 2 spaces in `package.json` and `pnpm-*.yaml`.
- End every file with a newline and trim trailing whitespace.

Follow these rules for prose, including Markdown files.

- Never hard wrap prose. Write each paragraph or list item on a single line.
- Use US spelling, for example "color" and "behavior".
- Keep every sentence at or under 40 words.
- Pretty print Markdown tables so the columns line up, with alignment markers on every separator line.

## Branches

Create a branch from `main` for each change. Name it `<type>/<short-description>` in lowercase with hyphens between words, for example `feat/add-typescript-config` or `fix/unused-vars-options`.

Use the same types as for commits.

## Commits

Write commit messages that follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). The `commit-msg` hook enforces this.

```text
<type>(<optional scope>): <description>
```

Keep the header and every line of the body at or under 72 characters. Use one of these types.

| Type       | Use for                                           |
|:-----------|:--------------------------------------------------|
| `feat`     | A new rule or config                              |
| `fix`      | A correction to an existing rule                  |
| `docs`     | Changes to documentation only                     |
| `refactor` | Changes that do not alter the behavior of configs |
| `test`     | Changes to tests only                             |
| `build`    | Changes to packaging, dependencies, or tooling    |
| `ci`       | Changes to the CI workflows                       |
| `chore`    | Other maintenance that does not fit above         |

Write the description in the imperative mood, such as "add typescript config". Mark a breaking change with `!` after the type or scope, and add a `BREAKING CHANGE:` footer that explains what consumers must do.

## Pull requests

- Keep each pull request to one change.
- Link the issue it addresses.
- Update the changelog and README in the same pull request.
- Use a title that follows the commit convention.

## License

By contributing, you agree that your contributions are licensed under the [MIT license](LICENSE).
