import type { OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { isModelContext } from './browser-tool.util';
import { InvoicePreviewComponent } from './invoice-preview.component';
import {
  COLOR_PALETTES,
  DEFAULT_TEMPLATE,
  EDITOR_TAB,
  FONT_FAMILIES,
  FONT_OPTIONS,
  LOGO_MIME_TYPES,
  MAX_LOGO_BYTES,
  MAX_TEMPLATE_NAME_LENGTH,
  MOBILE_VIEW,
  PAYMENT_OPTIONS,
  STORAGE_KEY,
  TOAST_DURATION_MS,
} from './template-state.constants';
import type { PaymentMethod, TemplateState } from './template-state.model';
import { isTemplateState, parseDesignPatch } from './template-state.util';

@Component({
  selector: 'app-root',
  imports: [FormsModule, InvoicePreviewComponent],
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  private savedTemplate: TemplateState | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly lifecycle = new AbortController();

  readonly editorTab = EDITOR_TAB;
  readonly mobileViews = MOBILE_VIEW;
  readonly fontOptions = FONT_OPTIONS;
  readonly maxTemplateNameLength = MAX_TEMPLATE_NAME_LENGTH;
  readonly logoAccept = LOGO_MIME_TYPES.join(',');

  readonly state = signal<TemplateState>(structuredClone(DEFAULT_TEMPLATE));
  readonly activeTab = signal<(typeof EDITOR_TAB)[keyof typeof EDITOR_TAB]>(EDITOR_TAB.design);
  readonly mobileView = signal<(typeof MOBILE_VIEW)[keyof typeof MOBILE_VIEW]>(MOBILE_VIEW.editor);
  readonly isSaved = signal(false);
  readonly toastMessage = signal('');
  readonly draftPayments = signal<PaymentMethod[]>([]);

  readonly paperFont = computed(() => FONT_FAMILIES[this.state().font]);
  readonly accentHex = computed(() => this.state().accent.toUpperCase());
  readonly inkHex = computed(() => this.state().ink.toUpperCase());
  readonly paymentChoices = computed(() =>
    PAYMENT_OPTIONS.map((payment) => ({
      ...payment,
      isSelected: this.draftPayments().includes(payment.label),
    })),
  );
  readonly palettes = computed(() =>
    COLOR_PALETTES.map((palette) => ({
      ...palette,
      isSelected: this.state().accent === palette.accent && this.state().ink === palette.ink,
    })),
  );

  constructor() {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

      if (isTemplateState(stored)) {
        this.savedTemplate = stored;
        this.state.set(structuredClone(stored));
        this.isSaved.set(true);
      }
    } catch {
      /* Storage can be unavailable in private browsing. */
    }

    this.registerTool();
  }

  update<Key extends keyof TemplateState>(key: Key, value: TemplateState[Key]): void {
    this.state.update((currentState) => ({ ...currentState, [key]: value }));
    this.isSaved.set(false);
  }

  setPalette(accent: string, ink: string): void {
    this.state.update((currentState) => ({ ...currentState, accent, ink }));
    this.isSaved.set(false);
  }

  save(): void {
    if (!this.state().name.trim()) {
      this.mobileView.set(MOBILE_VIEW.editor);
      this.activeTab.set(EDITOR_TAB.design);
      this.notify('Please add a template name.');

      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
      this.savedTemplate = structuredClone(this.state());
      this.isSaved.set(true);
      this.notify('Template saved in this browser.');
    } catch {
      this.notify('Could not save. Try a smaller logo or allow browser storage.');
    }
  }

  reset(): void {
    this.state.set(structuredClone(this.savedTemplate ?? DEFAULT_TEMPLATE));
    this.isSaved.set(Boolean(this.savedTemplate));
    this.notify(this.savedTemplate ? 'Changes discarded.' : 'Default settings restored.');
  }

  uploadLogo(event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const file = input.files?.[0];

    input.value = '';

    if (!file) {
      return;
    }

    if (!LOGO_MIME_TYPES.includes(file.type) || file.size > MAX_LOGO_BYTES) {
      this.notify('Choose a PNG, JPG or SVG up to 2 MB.');

      return;
    }

    const reader = new FileReader();

    reader.onload = (): void => {
      const logoSource = reader.result;

      if (typeof logoSource !== 'string') {
        this.notify('This file could not be read.');

        return;
      }

      const image = new Image();

      image.onload = (): void => {
        this.state.update((currentState) => ({ ...currentState, logo: logoSource, logoVisible: true }));
        this.isSaved.set(false);
        this.notify('Logo updated.');
      };

      image.onerror = (): void => this.notify('This image could not be loaded.');
      image.src = logoSource;
    };

    reader.onerror = (): void => this.notify('This file could not be read.');
    reader.readAsDataURL(file);
  }

  openPayments(dialog: HTMLDialogElement): void {
    this.draftPayments.set([...this.state().payments]);
    dialog.showModal();
  }

  togglePayment(label: PaymentMethod, event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const isChecked = input.checked;

    this.draftPayments.update((payments) => (isChecked ? [...payments, label] : payments.filter((payment) => payment !== label)));
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
    clearTimeout(this.toastTimer);
    this.lifecycle.abort();
  }

  private notify(text: string): void {
    clearTimeout(this.toastTimer);
    this.toastMessage.set(text);
    this.toastTimer = setTimeout(() => this.toastMessage.set(''), TOAST_DURATION_MS);
  }

  private registerTool(): void {
    const context = 'modelContext' in document ? document.modelContext : undefined;

    if (!isModelContext(context)) {
      return;
    }

    try {
      Promise.resolve(
        context.registerTool(
          {
            annotations: { readOnlyHint: false },
            description: 'Change the current template name and colors in the preview without saving.',
            execute: (input: unknown) => {
              const patch = parseDesignPatch(input);

              this.state.update((currentState) => ({ ...currentState, ...patch }));
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
