import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PubService } from '@wkpcamer/actions';
import { Pub, PubDetail } from '@wkpcamer/models';
import { CardModule } from 'primeng/card';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-pub-skyscraper',
  imports: [
    CardModule,
    NgOptimizedImage
],
  templateUrl: './pub-skyscraper.component.html',
  styleUrl: './pub-skyscraper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PubSkyscraperComponent  {


  //pub!:PubDetail;

   // Injects
  private readonly pubService=inject(PubService)
  private readonly platformId = inject(PLATFORM_ID);
  //private readonly dimension$ = new BehaviorSubject<number>(728);
  private readonly isBrowser= signal(isPlatformBrowser(this.platformId));




  // Signal pour la dimension (utilisé dans le template)
  protected readonly dimensionSignal = signal(728);

  @Input()
    set dimension(value: number) {
    if (value && value !== this.dimensionSignal()) {
      this.dimensionSignal.set(value);
    }
  }
  /**
   *
   */

  protected readonly pub = signal<PubDetail | null>(null);


 protected readonly imageUrl = computed(() => {
    const pubData = this.pub();
    if (!pubData) return '';

    return pubData.image_url.startsWith('http')
      ? pubData.image_url
      : `https://www.camer.be${pubData.image_url}`;
  });

  protected readonly isLoading = signal(false);

  protected readonly error = signal<string | null>(null);
  /**
   *
   */
  constructor() {
    if (this.isBrowser()) {
       effect(() => {
        const dimension = this.dimensionSignal();
        if (dimension) {
          this.loadPub(dimension);
        }
      }, {
        allowSignalWrites: true
      });
    }

  }
  private loadPub(dimension: number) {
    // Réinitialiser l'état
    this.isLoading.set(true);
    this.error.set(null);
    this.pub.set(null); // 🔥 Réinitialiser la pub précédente
    this.pubService.getRandomPub(dimension).pipe(
      map(response => {
        const tmpData = response as unknown as Pub;
        return tmpData["data"] as unknown as PubDetail;
      }),
      catchError(error => {
        console.error(`Erreur chargement pub (dimension ${dimension}):`, error);

        // ✅ Gestion d'erreur améliorée
        let errorMessage = 'Erreur de chargement de la publicité';

        if (error.status === 404) {
          errorMessage = `Aucune publicité disponible pour la dimension ${dimension}`;
        } else if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur';
        }

        this.error.set(errorMessage);
        return of(null);
      })
    ).subscribe(pubData => {
      this.isLoading.set(false);
      if (pubData) {
        this.pub.set(pubData);
      }
    });
  }

  // ✅ Computed pour vérifier le type de format
  protected readonly isCardFormat = computed(() => this.dimensionSignal() === 300);
  protected readonly isBannerFormat = computed(() => this.dimensionSignal() === 728);


  // ✅ Computed pour vérifier si on a une pub valide
  protected readonly hasValidPub = computed(() => !!this.pub());

}
