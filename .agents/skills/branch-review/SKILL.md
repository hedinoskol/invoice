---
name: branch-review
description:
  Review an invoice branch, working-tree diff, commit or commit range for actionable regressions and project-convention violations.
---

# Branch review

Adapted from the supplied branch-review skill for this Angular CLI repository and native Git commands. Review the requested change, not the
whole repository. A review request is read-only unless the user also requests implementation.

## Scope and context

1. Read root `AGENTS.md`, relevant nested instructions, `README.md` and `git status --short`.
2. Resolve the requested scope before reviewing:
   - Local changes: inspect staged and unstaged diffs plus relevant untracked source files.
   - Branch comparison: use the requested base and verify its merge base. If no base is specified, inspect repository refs; ask when the
     intended base remains ambiguous rather than assuming an unrelated `staging` branch.
   - Single commit or explicit range: inspect exactly those committed changes, excluding the working tree.
3. Read the changed-file list before loading full diffs and relevant sibling skills. Inspect surrounding callers only to assess the change.

## Review passes

Assess the change through three distinct lenses:

- Correctness: state transitions, storage validation, asynchronous logo uploads, timer/tool cleanup and browser capability detection.
- Project structure: existing Angular CLI layout, ownership of state, presentation boundaries and actual project conventions.
- Framework and language: installed Angular APIs, signals, TypeScript narrowing, template behavior, accessibility and CSS/SCSS effects.

For substantial reviews, independent subagents may handle these lenses when delegation is available and authorized. Give each the exact same
scope, relevant context and read-only constraints; request candidates rather than final verdicts. For small diffs, perform the passes
locally.

Check affected desktop/mobile preview and print behavior where relevant. Treat tests as evidence only when they exist and were run. During a
read-only review, use check commands rather than `--fix`, `--write`, builds or other commands that mutate files. Do not read existing remote
reviewer discussions to manufacture an independent finding, or post results remotely without authorization.

## Evidence and output

- Validate each candidate against actual callers and documented contracts. Use history only to resolve a concrete uncertainty.
- Report only issues introduced, exposed or worsened by the requested diff. Deduplicate findings with the same root cause.
- Discard speculative candidates; retain findings only with at least 80/100 internal confidence.
- Order findings by impact: `[CRITICAL]`, `[HIGH]`, `[MED]`, `[LOW]`. Include a precise file/line, trigger and practical consequence.
- Finish with a concise verdict and meaningful validation gaps. If no findings survive, say no material issues were found and state the
  scope and verification limits. Do not imply that an untested behavior is proven correct.
