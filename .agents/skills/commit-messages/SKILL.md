---
name: commit-messages
description: Draft commit messages and PR titles for invoice when the user requests commit or pull-request work.
---

# Commit messages

Adapted from the supplied commit-messages skill. This project has no Jira ticket requirement or commitlint hook. Do not invent ticket IDs or
claim a hook enforces these conventions.

Use `<type>(<optional-scope>): <subject>` for new messages, unless the user specifies a different format.

- Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`.
- Use `build` for tooling and dependency changes, `docs` for prose, and `style` for formatting-only changes.
- Keep the subject specific, imperative, lowercase initially, without a trailing period; keep the header within 100 characters.
- Use a short scope from the actual change, such as `editor`, `preview`, `styles` or `tooling`.
- Add a body only when it explains motivation or a non-obvious tradeoff. Add a breaking-change footer only for an actual contract break.
- If a commit is rejected by a hook, inspect and fix the cause. Do not amend a previous commit assuming the rejected commit exists. Do not
  bypass hooks to conceal failing checks.
- A request to draft a message is not a request to stage, commit, push or publish it.

Examples:

```text
build(tooling): enable stylelint for scss
fix(preview): restore saved template colors
docs: add project development skills
```
