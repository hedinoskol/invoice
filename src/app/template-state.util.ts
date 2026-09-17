import { FONT_OPTIONS, MAX_TEMPLATE_NAME_LENGTH, PAYMENT_OPTIONS } from './template-state.constants';
import type { Font, PaymentMethod, TemplateState } from './template-state.model';

export function isColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

export function isFont(value: unknown): value is Font {
  return FONT_OPTIONS.some((font) => font.value === value);
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return PAYMENT_OPTIONS.some((payment) => payment.label === value);
}

export function isTemplateState(value: unknown): value is TemplateState {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return (
    'name' in value &&
    typeof value.name === 'string' &&
    'company' in value &&
    typeof value.company === 'string' &&
    'email' in value &&
    typeof value.email === 'string' &&
    'client' in value &&
    typeof value.client === 'string' &&
    'invoiceTitle' in value &&
    typeof value.invoiceTitle === 'string' &&
    'note' in value &&
    typeof value.note === 'string' &&
    'terms' in value &&
    typeof value.terms === 'string' &&
    'accent' in value &&
    isColor(value.accent) &&
    'ink' in value &&
    isColor(value.ink) &&
    'font' in value &&
    isFont(value.font) &&
    'logoVisible' in value &&
    typeof value.logoVisible === 'boolean' &&
    'logo' in value &&
    (value.logo === null || (typeof value.logo === 'string' && /^data:image\/(png|jpeg|svg\+xml);base64,/.test(value.logo))) &&
    'payments' in value &&
    Array.isArray(value.payments) &&
    value.payments.every(isPaymentMethod)
  );
}

export function parseDesignPatch(input: unknown): Partial<Pick<TemplateState, 'accent' | 'ink' | 'name'>> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    throw new Error('Invalid input');
  }

  const patch: Partial<Pick<TemplateState, 'accent' | 'ink' | 'name'>> = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'name' && typeof value === 'string' && value.trim() && value.length <= MAX_TEMPLATE_NAME_LENGTH) {
      patch.name = value;
    } else if ((key === 'accent' || key === 'ink') && isColor(value)) {
      patch[key] = value;
    } else {
      throw new Error('Invalid template setting');
    }
  }

  return patch;
}
