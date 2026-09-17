import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InvoiceStudioStore } from '../invoice-studio.store';
@Component({
  selector: 'app-invoice-studio-rail',
  imports: [],
  standalone: true,
  templateUrl: './invoice-studio-rail.component.html',
  styleUrl: './invoice-studio-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceStudioRailComponent {
  readonly studio = inject(InvoiceStudioStore);
}
