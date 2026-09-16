import {ChangeDetectionStrategy, Component, computed, signal, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';

type Font = 'sans' | 'serif' | 'mono';

interface TemplateState {
    name: string;
    accent: string;
    ink: string;
    font: Font;
    logoVisible: boolean;
    logo: string | null;
    company: string;
    email: string;
    client: string;
    invoiceTitle: string;
    note: string;
    terms: string;
    payments: string[];
}

const DEFAULTS: TemplateState = {
    name: 'Standard template', accent: '#cef75c', ink: '#252b28', font: 'sans', logoVisible: true, logo: null,
    company: 'Forma Studio', email: 'hello@forma.design', client: 'Horizon Ltd.', invoiceTitle: 'Invoice',
    note: 'Thank you for creating something great with us.',
    terms: 'Payment is due within 14 days of the invoice date. Please include the invoice number in your payment reference.',
    payments: ['Bank transfer', 'Credit card']
};
const STORAGE_KEY = 'folio-template-en-v1';
const FONTS: Record<Font, string> = {
    sans: "'Golos Text',Arial,sans-serif",
    serif: "Georgia,'Times New Roman',serif",
    mono: "'Courier New',monospace"
};
const isColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {
    readonly state = signal<TemplateState>(structuredClone(DEFAULTS));
    readonly activeTab = signal<'design' | 'content'>('design');
    readonly mobileView = signal<'editor' | 'preview'>('editor');
    readonly isSaved = signal(false);
    readonly toastMessage = signal('');
    readonly draftPayments = signal<string[]>([]);
    readonly paperFont = computed(() => FONTS[this.state().font]);
    readonly accentInk = computed(() => {
        const rgb = this.state().accent.match(/[a-f\d]{2}/gi)!.map(x => parseInt(x, 16));
        return rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114 > 145 ? '#20251e' : '#ffffff';
    });
    private saved: TemplateState | null = null;
    private timer?: ReturnType<typeof setTimeout>;
    private lifecycle = new AbortController();

    constructor() {
        try {
            const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (this.isTemplate(stored)) {
                this.saved = stored;
                this.state.set(structuredClone(stored));
                this.isSaved.set(true);
            }
        } catch { /* Storage can be unavailable in private browsing. */
        }
        this.registerTool();
    }

    private isTemplate(value: unknown): value is TemplateState {
        if (!value || typeof value !== 'object') return false;
        const s = value as Record<string, unknown>;
        return ['name', 'company', 'email', 'client', 'invoiceTitle', 'note', 'terms'].every(k => typeof s[k] === 'string') &&
            isColor(s['accent']) && isColor(s['ink']) && ['sans', 'serif', 'mono'].includes(String(s['font'])) &&
            typeof s['logoVisible'] === 'boolean' && (s['logo'] === null || (typeof s['logo'] === 'string' && /^data:image\/(png|jpeg|svg\+xml);base64,/.test(s['logo']))) &&
            Array.isArray(s['payments']) && s['payments'].every(p => ['Bank transfer', 'Credit card', 'PayPal'].includes(p));
    }

    update<K extends keyof TemplateState>(key: K, value: TemplateState[K]) {
        this.state.update(s => ({...s, [key]: value}));
        this.isSaved.set(false);
    }

    setPalette(accent: string, ink: string) {
        this.state.update(s => ({...s, accent, ink}));
        this.isSaved.set(false);
    }

    save() {
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

    reset() {
        this.state.set(structuredClone(this.saved || DEFAULTS));
        this.isSaved.set(!!this.saved);
        this.notify(this.saved ? 'Changes discarded.' : 'Default settings restored.');
    }

    uploadLogo(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type) || file.size > 2 * 1024 * 1024) {
            this.notify('Choose a PNG, JPG or SVG up to 2 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const src = String(reader.result);
            const image = new Image();
            image.onload = () => {
                this.state.update(s => ({...s, logo: src, logoVisible: true}));
                this.isSaved.set(false);
                this.notify('Logo updated.');
            };
            image.onerror = () => this.notify('This image could not be loaded.');
            image.src = src;
        };
        reader.onerror = () => this.notify('This file could not be read.');
        reader.readAsDataURL(file);
    }

    openPayments(dialog: HTMLDialogElement) {
        this.draftPayments.set([...this.state().payments]);
        dialog.showModal();
    }

    togglePayment(label: string, event: Event) {
        const checked = (event.target as HTMLInputElement).checked;
        this.draftPayments.update(p => checked ? [...p, label] : p.filter(x => x !== label));
    }

    closePayments(event: Event, dialog: HTMLDialogElement) {
        event.preventDefault();
        this.update('payments', [...this.draftPayments()]);
        dialog.close();
    }

    print() {
        window.print();
    }

    private notify(text: string) {
        clearTimeout(this.timer);
        this.toastMessage.set(text);
        this.timer = setTimeout(() => this.toastMessage.set(''), 3200);
    }

    private registerTool() {
        type Tool = {
            name: string;
            title: string;
            description: string;
            inputSchema: object;
            annotations: object;
            execute: (input: unknown) => unknown
        };
        const context = (document as Document & {
            modelContext?: { registerTool: (tool: Tool, options: { signal: AbortSignal }) => unknown }
        }).modelContext;
        if (!context?.registerTool) return;
        try {
            Promise.resolve(context.registerTool({
                name: 'configure_invoice_design',
                title: 'Configure invoice design',
                description: 'Change the current template name and colors in the preview without saving.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {type: 'string'},
                        accent: {type: 'string', pattern: '^#[0-9a-fA-F]{6}$'},
                        ink: {type: 'string', pattern: '^#[0-9a-fA-F]{6}$'}
                    },
                    additionalProperties: false
                },
                annotations: {readOnlyHint: false},
                execute: (input: unknown) => {
                    if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Invalid input');
                    const patch = input as Record<string, unknown>;
                    for (const [key, value] of Object.entries(patch)) {
                        if (!['name', 'accent', 'ink'].includes(key) || (key === 'name' ? typeof value !== 'string' || !value.trim() || value.length > 60 : !isColor(value))) throw Error('Invalid template setting');
                    }
                    this.state.update(s => ({...s, ...patch}));
                    this.isSaved.set(false);
                    return {name: this.state().name, accent: this.state().accent, ink: this.state().ink, saved: false};
                }
            }, {signal: this.lifecycle.signal})).catch(() => {
            });
        } catch { /* Optional browser API. */
        }
    }

    ngOnDestroy() {
        clearTimeout(this.timer);
        this.lifecycle.abort();
    }
}
