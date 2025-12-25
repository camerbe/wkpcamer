import { provideEffects } from '@ngrx/effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch()) ,//, withCredentials(),
    provideStore({}),
    provideEffects([]),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    //provideZoneChangeDetection({ eventCoalescing: true }),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    providePrimeNG({
      ripple: true,
      theme: {
            preset: Aura,
      },
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
  ],
};
