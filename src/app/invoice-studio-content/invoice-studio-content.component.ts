import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InvoiceEditorComponent } from '../invoice-editor/invoice-editor.component';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';
import { InvoiceStudioStore } from '../invoice-studio.store';
@Component({
  selector: 'app-invoice-studio-content',
  imports: [InvoiceEditorComponent, InvoicePreviewComponent],
  standalone: true,
  templateUrl: './invoice-studio-content.component.html',
  styleUrl: './invoice-studio-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceStudioContentComponent {
  readonly studio = inject(InvoiceStudioStore);
}
