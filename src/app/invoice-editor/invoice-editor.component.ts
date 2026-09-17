import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InvoiceStudioStore } from '../invoice-studio.store';
@Component({
  selector: 'app-invoice-editor',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './invoice-editor.component.html',
  styleUrl: './invoice-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceEditorComponent {
  readonly studio = inject(InvoiceStudioStore);
}
