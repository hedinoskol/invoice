import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { InvoiceStudioStore } from './invoice-studio.store';
import { InvoiceStudioContentComponent } from './invoice-studio-content/invoice-studio-content.component';
import { InvoiceStudioRailComponent } from './invoice-studio-rail/invoice-studio-rail.component';
@Component({
  selector: 'app-root',
  imports: [InvoiceStudioRailComponent, InvoiceStudioContentComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly studio = inject(InvoiceStudioStore);
}
