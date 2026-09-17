import type { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Font = 'mono' | 'sans' | 'serif';

interface TemplateState {
  accent: string;
  client: string;
  company: string;
  email: string;
  font: Font;
  ink: string;
  invoiceTitle: string;
  logo: string | null;
  logoVisible: boolean;
  name: string;
  note: string;
  payments: string[];
  terms: string;
}

const DEFAULTS: TemplateState = {
  accent: '#cef75c',
  client: 'Horizon Ltd.',
  company: 'Forma Studio',
  email: 'hello@forma.design',
  font: 'sans',
  ink: '#252b28',
  invoiceTitle: 'Invoice',
  logo: null,
  logoVisible: true,
  name: 'Standard template',
  note: 'Thank you for creating something great with us.',
  payments: ['Bank transfer', 'Credit card'],
  terms: 'Payment is due within 14 days of the invoice date. Please include the invoice number in your payment reference.',
};
const LUMINANCE_WEIGHTS = { blue: 0.114, green: 0.587, red: 0.299 };
const LUMINANCE_THRESHOLD = 145;
const MAX_LOGO_BYTES = 2_097_152;
const TOAST_DURATION_MS = 3200;
const MAX_TEMPLATE_NAME_LENGTH = 60;
const STORAGE_KEY = 'folio-template-en-v1';
const FONTS: Record<Font, string> = {
  mono: "'Courier New',monospace",
  sans: "'Golos Text',Arial,sans-serif",
  serif: "Georgia,'Times New Roman',serif",
};
const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  private saved: TemplateState | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  private readonly lifecycle = new AbortController();

  readonly state = signal<TemplateState>(structuredClone(DEFAULTS));
  readonly activeTab = signal<'content' | 'design'>('design');
  readonly mobileView = signal<'editor' | 'preview'>('editor');
  readonly isSaved = signal(false);
  readonly toastMessage = signal('');
  readonly draftPayments = signal<string[]>([]);

  readonly paperFont = computed(() => FONTS[this.state().font]);
  readonly accentInk = computed(() => {
    const [red, green, blue] = this.state()
      .accent.match(/[a-f\d]{2}/gi)!
      .map((x) => parseInt(x, 16));

    return red * LUMINANCE_WEIGHTS.red + green * LUMINANCE_WEIGHTS.green + blue * LUMINANCE_WEIGHTS.blue > LUMINANCE_THRESHOLD
      ? '#20251e'
      : '#ffffff';
  });

  constructor() {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

      if (this.isTemplate(stored)) {
        this.saved = stored;
        this.state.set(structuredClone(stored));
        this.isSaved.set(true);
      }
    } catch {
      /* Storage can be unavailable in private browsing. */
    }

    this.registerTool();
  }

  update<K extends keyof TemplateState>(key: K, value: TemplateState[K]): void {
    this.state.update((s) => ({ ...s, [key]: value }));
    this.isSaved.set(false);
  }

  setPalette(accent: string, ink: string): void {
    this.state.update((s) => ({ ...s, accent, ink }));
    this.isSaved.set(false);
  }

  save(): void {
    if (!this.state().name.trim()) {
      this.mobileView.set('editor');
      this.activeTab.set('design');
      this.notify('Please add a template name.');

      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
      this.saved = structuredClone(this.state());
      this.isSaved.set(true);
      this.notify('Template saved in this browser.');
    } catch {
      this.notify('Could not save. Try a smaller logo or allow browser storage.');
    }
  }

  reset(): void {
    this.state.set(structuredClone(this.saved || DEFAULTS));
    this.isSaved.set(Boolean(this.saved));
    this.notify(this.saved ? 'Changes discarded.' : 'Default settings restored.');
  }

  uploadLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    input.value = '';

    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type) || file.size > MAX_LOGO_BYTES) {
      this.notify('Choose a PNG, JPG or SVG up to 2 MB.');

      return;
    }

    const reader = new FileReader();

    reader.onload = (): void => {
      const src = String(reader.result);
      const image = new Image();

      image.onload = (): void => {
        this.state.update((s) => ({ ...s, logo: src, logoVisible: true }));
        this.isSaved.set(false);
        this.notify('Logo updated.');
      };

      image.onerror = (): void => this.notify('This image could not be loaded.');
      image.src = src;
    };

    reader.onerror = (): void => this.notify('This file could not be read.');
    reader.readAsDataURL(file);
  }

  openPayments(dialog: HTMLDialogElement): void {
    this.draftPayments.set([...this.state().payments]);
    dialog.showModal();
  }

  togglePayment(label: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.draftPayments.update((p) => (checked ? [...p, label] : p.filter((x) => x !== label)));
  }

  closePayments(event: Event, dialog: HTMLDialogElement): void {
    event.preventDefault();
    this.update('payments', [...this.draftPayments()]);
    dialog.close();
  }

  print(): void {
    window.print();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.lifecycle.abort();
  }

  private isTemplate(value: unknown): value is TemplateState {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const s = value as Record<string, unknown>;

    return (
      ['name', 'company', 'email', 'client', 'invoiceTitle', 'note', 'terms'].every((k) => typeof s[k] === 'string') &&
      isColor(s['accent']) &&
      isColor(s['ink']) &&
      ['sans', 'serif', 'mono'].includes(String(s['font'])) &&
      typeof s['logoVisible'] === 'boolean' &&
      (s['logo'] === null || (typeof s['logo'] === 'string' && /^data:image\/(png|jpeg|svg\+xml);base64,/.test(s['logo']))) &&
      Array.isArray(s['payments']) &&
      s['payments'].every((p) => ['Bank transfer', 'Credit card', 'PayPal'].includes(p))
    );
  }

  private notify(text: string): void {
    clearTimeout(this.timer);
    this.toastMessage.set(text);
    this.timer = setTimeout(() => this.toastMessage.set(''), TOAST_DURATION_MS);
  }

  private registerTool(): void {
    interface Tool {
      annotations: object;
      description: string;
      execute: (input: unknown) => unknown;
      inputSchema: object;
      name: string;
      title: string;
    }

    const context = (
      document as Document & {
        modelContext?: { registerTool: (tool: Tool, options: { signal: AbortSignal }) => unknown };
      }
    ).modelContext;

    if (!context?.registerTool) {
      return;
    }

    try {
      Promise.resolve(
        context.registerTool(
          {
            annotations: { readOnlyHint: false },
            description: 'Change the current template name and colors in the preview without saving.',
            execute: (input: unknown) => {
              if (!input || typeof input !== 'object' || Array.isArray(input)) {
                throw Error('Invalid input');
              }

              const patch = input as Record<string, unknown>;

              for (const [key, value] of Object.entries(patch)) {
                if (
                  !['name', 'accent', 'ink'].includes(key) ||
                  (key === 'name' ? typeof value !== 'string' || !value.trim() || value.length > MAX_TEMPLATE_NAME_LENGTH : !isColor(value))
                ) {
                  throw Error('Invalid template setting');
                }
              }

              this.state.update((s) => ({ ...s, ...patch }));
              this.isSaved.set(false);

              return { accent: this.state().accent, ink: this.state().ink, name: this.state().name, saved: false };
            },
            inputSchema: {
              additionalProperties: false,
              properties: {
                accent: { pattern: '^#[0-9a-fA-F]{6}$', type: 'string' },
                ink: { pattern: '^#[0-9a-fA-F]{6}$', type: 'string' },
                name: { type: 'string' },
              },
              type: 'object',
            },
            name: 'configure_invoice_design',
            title: 'Configure invoice design',
          },
          { signal: this.lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser API. */
    }
  }
}
