import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AdsenseService } from '../../services/adsense.service';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-adsense',
  imports: [],
  templateUrl: './adsense.component.html',
  styleUrl: './adsense.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdsenseComponent implements AfterViewInit{
  // ✅ Utilisation des signal inputs
  readonly adClient = input<string>('ca-pub-8638642715460968');
  readonly adSlot = input<string>('6927429462');
  readonly adFormat = input<string>('auto');
  readonly fullWidthResponsive = input<boolean>(true);

  isBrowser=signal(false);
  private readonly adsenseService=inject(AdsenseService)
  private readonly platformId = inject(PLATFORM_ID);

  // ✅ Signal pour l'état de chargement (optionnel, pour débugger)
  protected readonly isLoading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);


  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    this.loadAdsense();

  }
  private async loadAdsense() : Promise<void>{
    try {
      this.isLoading.set(true);

      // ✅ Gestion propre des promesses avec async/await
      await this.adsenseService.loadAdsenseScript(this.adClient());

      // ✅ Optionnel : délai pour s'assurer que le DOM est prêt
      await this.delay(100);
      this.adsenseService.pushAd();

    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to load AdSense script';

      this.error.set(errorMessage);
      console.error('AdSense loading error:', error);

    } finally {
      this.isLoading.set(false);
    }
  }
  private delay(ms: number): Promise<void> {
     return new Promise(resolve => setTimeout(resolve, ms));
  }


}
