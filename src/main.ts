import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

// Report bootstrap failures when Angular cannot render its own error UI.
// eslint-disable-next-line no-console
bootstrapApplication(AppComponent).catch(console.error);
