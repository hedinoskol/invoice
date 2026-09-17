---
name: development-conventions
description: Apply invoice project conventions when writing or reviewing Angular components, TypeScript, templates, CSS or SCSS.
---

# Invoice development conventions

Adapted from the supplied development-conventions skill for this Angular CLI application. Use alongside
[angular-developer](../angular-developer/SKILL.md) and, for TypeScript changes, [clean-typescript](../clean-typescript/SKILL.md). Read only
guidance relevant to the requested work.

## Project boundaries

- Keep application code in `src/`. Use relative imports and the existing Angular CLI configuration.
- Organize new utilities by responsibility (`color.util.ts`, for example), rather than creating generic `helpers.ts` collections.
- Separate state orchestration from presentation when complexity warrants it. Presentational components receive inputs and emit outputs.
- Keep the existing template-driven forms strategy when editing forms. Preserve browser-only storage and print behavior.
- Add configuration and dependencies for actual requirements. Do not import another repository's Nx layout, aliases or generators.

## Naming and TypeScript

- Use descriptive names, including callback parameters. Avoid single-letter value identifiers and redundant type suffixes.
- Start action methods with verbs. Reserve `is` for booleans and predicates; use `$` for observables, not signals.
- Use `UPPER_SNAKE_CASE` for shared constants and no `I` prefix on interfaces.
- Prefer explicit `Boolean`, `Number` and `String` conversions over coercion shorthand.
- Treat optional properties as meaningful absence, not a substitute for modeling separate states. Browser capability detection can be
  optional.
- Follow `eslint.config.mjs` for type definitions, return types, imports and class ordering; preserve initialization dependencies when
  sorting.

## Components and templates

- Use standalone components with `ChangeDetectionStrategy.OnPush` and signal-based state.
- Keep injected service instances in named fields before deriving properties from them.
- Use `computed` for derived display values instead of repeatedly calculating them in template bindings. Signal reads and event handlers
  remain valid template calls. Do not introduce memoization dependencies.
- Use named constants or union-backed values for repeated behavioral choices. Literal user-facing text is not a reason to add i18n tooling.
- When using RxJS, avoid nested subscriptions. Prefer `async` or signal interop for view data and provide teardown for manual subscriptions.

## Styles and validation

- Follow the project Prettier and Stylelint configurations for CSS and SCSS.
- Write BEM element/modifier class names in full rather than concatenating `&__element` or `&--modifier`. Use `&` for pseudo-classes,
  pseudo-elements and state combinations where useful.
- Use `::` for pseudo-elements and `:` for pseudo-classes.
- Run `npm run lint` and `npm run format:check` after relevant edits. Build after application or build-configuration changes.
- During review, report existing violations only when the requested change introduces, exposes or worsens them.
