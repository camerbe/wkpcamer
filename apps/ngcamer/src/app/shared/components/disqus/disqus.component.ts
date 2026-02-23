import { isPlatformBrowser } from '@angular/common';
import { Component, OnChanges, Input, AfterViewInit, OnDestroy, SimpleChanges, ElementRef, inject, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';

declare global {
  interface Window {
    DISQUS: any;
    disqus_config: (() => void) | undefined;
  }
}

interface DisqusConfig {
  page: {
    identifier: string;
    url: string;
    title?: string;
  };
}

@Component({
  selector: 'app-disqus',
  standalone: true,
  imports: [


  ],
  template: `<div id="disqus_thread"></div>`,
  styleUrl: './disqus.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisqusComponent implements AfterViewInit, OnChanges, OnDestroy {

   @Input() identifier!: string;
   @Input() url!: string;
   @Input() title?: string;

   private observer?: IntersectionObserver;
   private hasLoaded = false;
   private scriptLoaded = false;
   private disqusShortname = 'camer-be';

  //************ INJECTION************************/
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

   private loadDisqus(): void {
    if (!this.identifier || !this.url) {
      console.warn('[Disqus] identifier et url sont requis');
      return;
    }

    this.hasLoaded = true;

    this.configureDisqus();

    this.injectDisqusScript();

  }
  private injectDisqusScript() {
    if (this.scriptLoaded || document.querySelector('script[src*="disqus.com/embed.js"]')) {
      return;
    }

    this.scriptLoaded = true;

    const script = document.createElement('script');
    script.src = `https://${this.disqusShortname}.disqus.com/embed.js`;
    script.async = true;
    script.defer = true;
    script.setAttribute('data-timestamp', String(new Date().getTime()));

    script.onerror = () => {
      console.error('[Disqus] Erreur lors du chargement du script');
      this.scriptLoaded = false;
    };

    (document.head || document.body).appendChild(script);
  }
  private configureDisqus() {
    window.disqus_config = this.getDisqusConfig();
  }
  private getDisqusConfig(): () => void {
    return () => {
      (window as any).page = {
        identifier: this.identifier,
        url: this.url,
        title: this.title || ''
      };
    };
  }

  getConfig(identifier: string, url: string, title?: string){
    return function (this: DisqusConfig) {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (
      this.hasLoaded &&
      this.scriptLoaded &&
      (changes['identifier'] || changes['url'])
    ) {
      this.reloadDisqus();
    }
  }
  private reloadDisqus() {
    if (window.DISQUS?.reset) {
      window.DISQUS.reset({
        reload: true,
        config: this.getDisqusConfig()
      });
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
  private cleanup():void {
    // Nettoyer l'observer
    this.observer?.disconnect();
    this.observer = undefined;

    // Nettoyer la configuration globale
    if (window.disqus_config) {
      window.disqus_config = undefined;
    }

    this.hasLoaded = false;
    this.scriptLoaded = false;
  }
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.setupIntersectionObserver();
  }
  private setupIntersectionObserver() {
    if (!this.el?.nativeElement) {
      return;
    }

    const options = {
      rootMargin: '200px',
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !this.hasLoaded) {
        this.loadDisqus();
        this.observer?.disconnect();
      }
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

}
