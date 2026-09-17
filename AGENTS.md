# Invoice project guidance

This is an Angular CLI application with standalone components, signals and template-driven forms. Check `package.json` for current versions
and commands. Application code is under `src/`.

## Project skills

Load the relevant skill when its task applies; do not execute all workflows for every change.

- [development-conventions](.agents/skills/development-conventions/SKILL.md): Angular, TypeScript, templates and styles conventions.
- [angular-developer](.agents/skills/angular-developer/SKILL.md): Angular implementation and framework decisions.
- [clean-typescript](.agents/skills/clean-typescript/SKILL.md): Types, narrowing and API boundaries.
- [branch-review](.agents/skills/branch-review/SKILL.md): Requested reviews of branches, local changes or commits.
- [commit-messages](.agents/skills/commit-messages/SKILL.md): Requested commit messages and PR titles.

These skills are adapted from the user-supplied Claude skills. They apply to future work and to code being changed; their presence is not a
request for a repository-wide refactor. Preserve the scope of the user's task. The active ESLint, Prettier and Stylelint configurations
determine mechanically enforced code style.

## Verification

Use BEM classes for application elements and state modifiers. Style classes instead of HTML tags or IDs; element selectors are reserved for
the global reset in `src/reboot.scss`. Keep the mobile-first breakpoints at 480, 768, 1024 and 1280px.

Use `npm run lint` and `npm run format:check` for code and formatting checks. Run `npm run build` after changing application code or build
configuration. No test runner is currently configured; do not report tests as passed when only lint or build ran.

## Project boundaries

Preserve localStorage save/reset behavior, optional browser tool registration, logo validation, responsive preview and A4 printing. Use the
existing relative imports and CSS/SCSS tooling. Add infrastructure only when needed for requested functionality. The source
brand-scaffolding skill depends on an absent brand generator and was not installed.
