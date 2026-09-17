---
name: angular-developer
description: Implement and maintain Angular features in invoice, including standalone components, signals, forms and browser integration.
license: MIT
metadata:
  author: Copyright 2026 Google LLC
  source: Adapted from the user-supplied angular-developer skill for invoice.
---

# Angular development

Read `package.json`, relevant TypeScript configuration and nearby code before selecting framework APIs. This project currently uses Angular
21, standalone components, signals, template-driven forms and client-side rendering. Use
[development-conventions](../development-conventions/SKILL.md) for project-specific decisions.

- Match the installed Angular version. Keep existing forms and state management unless the task calls for a migration.
- Use the installed Angular CLI for scaffolding when it helps keep generated files consistent with the project.
- Use writable signals for state and `computed` for derived values. Do not use effects to copy derived state between signals.
- Prefer signal inputs and outputs for new component APIs. Keep state mutation in the component or service that owns the state.
- Keep `OnPush` change detection. Update signal values without mutating nested state in place.
- Model UI events separately from derived display values. Use stable tracking keys for repeated template content.
- Preserve accessible labels, keyboard operation and native dialog semantics when changing forms or controls.
- Guard optional browser integrations, handle unavailable storage and clean up timers, subscriptions and registered tools.
- Preserve live preview, saved-template reset, logo upload validation, mobile views and A4 print layout when touching those areas.
- Keep styling compatible with the project's CSS/SCSS lint configuration. Do not introduce a styling framework for incidental changes.
- After generating or changing application code, run `npm run build` and fix build failures caused by the change. Run relevant existing
  checks; do not invent a test command when the project has no test runner.

For APIs beyond the current application, consult the version-matched official Angular documentation before implementation. Do not add
routing, SSR or another forms framework merely because those capabilities exist in Angular.
