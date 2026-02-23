import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, PLATFORM_ID, Renderer2, viewChild } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

//declare let Viralize: any;
@Component({
  selector: 'app-viralize-ad',
  imports: [],
  template: `
    @if (isBrowser) {
      <div #adContainer></div>
    }
  `,
  styleUrl: './viralize-ad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViralizeAdComponent implements  AfterViewInit {
  zid = input.required<string>();
  private readonly adContainer = viewChild<ElementRef>('adContainer');

  private readonly renderer=inject(Renderer2);
  private readonly platformId=inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  //@ViewChild('adContainer', { static: true }) scriptContainer!: ElementRef;
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  private scriptElement?: HTMLScriptElement;

  
  ngAfterViewInit(): void {
   if (this.isBrowser) {
      this.injectViralizeScript();
      this.setupCleanup();
    }
  }
  private setupCleanup() {
    this.destroyRef.onDestroy(() => {
      const container = this.adContainer()?.nativeElement;
      if (container) {
        // Supprimer le script proprement
        if (this.scriptElement && this.scriptElement.parentNode) {
          this.renderer.removeChild(container, this.scriptElement);
        }

        // Nettoyer le container
        container.innerHTML = '';

        // Nettoyer la référence
        this.scriptElement = undefined;
      }
    });
  }
  private injectViralizeScript() {
    const container = this.adContainer()?.nativeElement;
    if (!container) {
      console.warn('ViralizeAd: Container not found');
      return;
    }

    // Nettoyer le contenu existant
    container.innerHTML = '';

    // Créer le script
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    this.renderer.setAttribute(script, 'data-wid', 'auto');
    this.renderer.setAttribute(script, 'type', 'text/javascript');
    this.renderer.setAttribute(script, 'src', `https://ads.viralize.tv/display/?zid=${this.zid()}`);

    // Ajouter le script
    this.renderer.appendChild(container, script);

    // Garder la référence pour le nettoyage
    this.scriptElement = script;

  }


}
