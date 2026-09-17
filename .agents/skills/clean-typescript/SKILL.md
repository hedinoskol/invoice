---
name: clean-typescript
description: Write and refactor TypeScript in invoice with readable types, explicit boundaries and safe narrowing.
---

# Clean TypeScript

Adapted from the supplied clean-typescript skill. Types should reduce bugs and cognitive load. Follow
[development-conventions](../development-conventions/SKILL.md) and the active ESLint configuration.

- Prefer readable types to clever generic constructions. Let TypeScript infer clear local values.
- Use `unknown` at untrusted boundaries and narrow it with guards. Avoid `any`, unchecked casts and non-null assertions.
- Validate persisted JSON, uploaded data and optional browser API inputs before using them as application state.
- Use interfaces for object shapes, matching this project's `consistent-type-definitions` rule. Use type aliases for unions, intersections
  and other shapes that need them. The source skill's general preference for aliases does not override the existing project linter.
- Give functions explicit return types as required by ESLint. Keep signatures small; use overloads only when they clarify callers.
- Model absence honestly with `null`, `undefined` or optional properties when the external API genuinely permits absence.
- Prefer union types and `as const` objects over runtime enums.
- Make failures visible at the appropriate boundary. Use typed results when callers need to distinguish failure states; preserve the error
  contract expected by browser integrations.
- Name callback values by meaning. Avoid restructuring unrelated code solely to satisfy a stylistic preference.
