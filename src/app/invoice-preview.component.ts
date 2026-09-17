import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { getContrastInk } from './color.util';
import { FONT_FAMILIES } from './template-state.constants';
import type { TemplateState } from './template-state.model';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  templateUrl: './invoice-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePreviewComponent {
  readonly state = input.required<TemplateState>();

  readonly printRequested = output<void>();

  readonly paperFont = computed(() => FONT_FAMILIES[this.state().font]);
  readonly accentInk = computed(() => getContrastInk(this.state().accent));
  readonly paymentSummary = computed(() => this.state().payments.join(' · '));
}
