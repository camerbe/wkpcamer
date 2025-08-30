import {
  ApplicationConfig,
  inject,
  Injector,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  runInInjectionContext,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
// Import Aura preset from PrimeNG theme presets
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideEffects } from '@ngrx/effects'; // Import providePrimeNG from PrimeNG
import { provideStore } from '@ngrx/store';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { from, switchMap } from 'rxjs';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(appRoutes),
    providePrimeNG({
        theme: {
            preset: Aura
        },
        ripple: true,
        translation: {
        accept: 'Accepter',
        reject: 'Rejeter',
        // calendrier
        dayNames: ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
        dayNamesShort: ["dim","lun","mar","mer","jeu","ven","sam"],
        dayNamesMin: ["D","L","M","M","J","V","S"],
        monthNames: [
          "janvier","février","mars","avril","mai","juin",
          "juillet","août","septembre","octobre","novembre","décembre"
        ],
        monthNamesShort: [
          "janv.","févr.","mars","avr.","mai","juin",
          "juil.","août","sept.","oct.","nov.","déc."
        ],
        today: "Aujourd'hui",
        clear: "Effacer",
        // autres
        choose: 'Choisir',
        upload: 'Téléverser',
        cancel: 'Annuler',
        firstDayOfWeek: 1
      }
    }),
    provideStore({}),
    provideEffects([]),
    provideHttpClient(withInterceptors([(req, next) => {
        const injector = inject(Injector);
        return from(import('@wkpcamer/users')).pipe(
          switchMap(m => runInInjectionContext(injector, () => m.jwtInterceptor(req, next)))
        );
      }])),



],
};




