import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
// Import Aura preset from PrimeNG theme presets
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
function provideAnimationsAsync(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

function providePrimeNG(arg0: { theme: { preset: any; }; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

