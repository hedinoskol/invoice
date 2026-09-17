# Folio Invoice Studio

An English-language, responsive invoice template editor built with Angular 21, standalone components, signals and template-driven forms.

## Development

Requires Node.js 20.19+, 22.12+, or 24.x.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4200.

## Code quality

```sh
npm run lint          # ESLint for TypeScript/Angular templates and Stylelint for CSS/SCSS
npm run lint:fix      # Apply automatic lint fixes
npm run format       # Format project files with Prettier
npm run format:check # Check formatting without changing files
npm run check        # Run lint, formatting checks and the production build
```

The configurations are adapted from the supplied reference files:

- Prettier uses a 140-character print width, two spaces, single quotes, trailing commas and automatic line endings. The HTML override
  targets `src/**/*.html` and keeps one attribute per line.
- ESLint checks Angular templates and TypeScript with type information from `tsconfig.eslint.json`, plus JavaScript configuration files. It
  applies Angular, import, naming and sorting rules. Prettier handles formatting.
- Stylelint uses the standard CSS preset and an SCSS preset for `.scss` files, plus the reference's property ordering, BEM class naming,
  nesting limits and other custom rules.

`node_modules/`, `dist/`, `.angular/` and `.idea/` are excluded from Git and formatting. Linters also exclude generated files and
dependencies.

## Project guidance

Global styles are in `src/styles.scss`, which loads `src/reboot.scss` before application rules. The `--osk-*` reset variables are defined in
the global stylesheet. New Angular components use SCSS by default.

[AGENTS.md](AGENTS.md) links to the five project skills in `.agents/skills/`: Angular development, development conventions, TypeScript,
branch review and commit messages. They are adapted to this repository's stack from the supplied Claude skills.

The editor owns template state, saving, logo uploads and payment selection. `InvoicePreviewComponent` receives the template through a signal
input and emits print requests. Template options and validation are kept in `template-state.*`; color calculations are in `color.util.ts`.

## Production

```sh
npm run build
```

Serve the `dist` directory with any static HTTP server. No backend is required. Template settings and uploaded logos are saved only in the
current browser's localStorage. Invoice amounts are sample data. The PDF button opens the browser print dialog; choose Save as PDF.

## Features

- Live invoice preview with brand colors, fonts and logo upload
- Editable company, recipient, title, payment terms and thank-you note
- Payment-method settings, local saving and reset to the last saved template
- Desktop split view and mobile settings/preview tabs
- Print layout for A4 invoices

The browser's optional WebMCP API can configure invoice design through the same Angular state. Google Fonts is optional; system fonts work
offline.
