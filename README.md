# Folio Invoice Studio

An English-language, responsive invoice template editor built with Angular 21, standalone components, signals and template-driven forms.

## Development

Requires Node.js 20.19+, 22.12+, or 24.x.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4200.

## Production

```sh
npm run build
```

Serve the `dist` directory with any static HTTP server. No backend is required. Template settings and uploaded logos are saved only in the current browser's localStorage. Invoice amounts are sample data. The PDF button opens the browser print dialog; choose Save as PDF.

## Features

- Live invoice preview with brand colors, fonts and logo upload
- Editable company, recipient, title, payment terms and thank-you note
- Payment-method settings, local saving and reset to the last saved template
- Desktop split view and mobile settings/preview tabs
- Print layout for A4 invoices

The browser's optional WebMCP API can configure invoice design through the same Angular state. Google Fonts is optional; system fonts work offline.
