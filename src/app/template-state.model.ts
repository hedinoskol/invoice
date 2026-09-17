export type Font = 'mono' | 'sans' | 'serif';

export type PaymentMethod = 'Bank transfer' | 'Credit card' | 'PayPal';

export interface TemplateState {
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
  payments: PaymentMethod[];
  terms: string;
}

export interface ColorPalette {
  accent: string;
  ink: string;
  label: string;
}
