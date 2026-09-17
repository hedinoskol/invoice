import type { ColorPalette, Font, PaymentMethod, TemplateState } from './template-state.model';

export const DEFAULT_TEMPLATE: TemplateState = {
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

export const FONT_FAMILIES: Record<Font, string> = {
  mono: "'Courier New',monospace",
  sans: "'Roboto',Arial,sans-serif",
  serif: "Georgia,'Times New Roman',serif",
};

export const FONT_OPTIONS: { label: string; value: Font }[] = [
  { label: 'Modern · Sans Serif', value: 'sans' },
  { label: 'Classic · Serif', value: 'serif' },
  { label: 'Technical · Mono', value: 'mono' },
];

export const PAYMENT_OPTIONS: { id: string; label: PaymentMethod }[] = [
  { id: 'bank', label: 'Bank transfer' },
  { id: 'card', label: 'Credit card' },
  { id: 'sbp', label: 'PayPal' },
];

export const COLOR_PALETTES: ColorPalette[] = [
  { accent: '#cef75c', ink: '#252b28', label: 'Lime & charcoal' },
  { accent: '#b7c9ff', ink: '#252a48', label: 'Blue & indigo' },
  { accent: '#ffc2a7', ink: '#57372f', label: 'Peach & cocoa' },
  { accent: '#e9d7fb', ink: '#473455', label: 'Lilac & plum' },
];

export const EDITOR_TAB = { content: 'content', design: 'design' } as const;
export const MOBILE_VIEW = { editor: 'editor', preview: 'preview' } as const;
export const STORAGE_KEY = 'folio-template-en-v1';
export const MAX_LOGO_BYTES = 2_097_152;
export const MAX_TEMPLATE_NAME_LENGTH = 60;
export const TOAST_DURATION_MS = 3200;
export const LOGO_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
