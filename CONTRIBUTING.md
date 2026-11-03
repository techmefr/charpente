# Contributing

## Themes

Themes are the easiest way to contribute.

1. Open a [theme idea](https://github.com/techmefr/charpente/issues/new?template=theme-request.yml) to talk about a look, or a [theme proposal](https://github.com/techmefr/charpente/issues/new?template=theme-proposal.yml) if it is already built.
2. Build it with the [tutorial](https://techmefr.github.io/charpente/create-a-theme/), or with `npx charpente-studio` which writes `themes/<name>/theme.ts` for you.
3. A theme is accepted when:
   - it stays readable in light and in dark;
   - its motion is calm and stops when the system asks for reduced motion;
   - its name is lowercase, with letters, digits and dashes;
   - you agree to publish it under the MIT license.

## Code

- Open an issue before a large change.
- Branch from `main`, keep one topic per pull request.
- Write no code comments, and never weaken an existing test: extend it.
- Run `pnpm build` and `pnpm --workspace-concurrency=1 test` before pushing.
- Pull requests are squash merged once the checks pass.
