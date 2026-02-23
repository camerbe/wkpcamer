import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal, ViewChild } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ad-moneytizer',
  imports: [],
  templateUrl: './ad-moneytizer.component.html',
  styleUrl: './ad-moneytizer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdMoneytizerComponent implements OnInit,OnDestroy {
  // ============ INPUTS ============
  @Input() appId!: string;
  @Input() zoneId!: string;

  @ViewChild('adContainer', { static: false }) adContainer?: ElementRef<HTMLDivElement>;

  // ============ INJECTIONS ============
  private platformId = inject(PLATFORM_ID);
  private renderer = inject(Renderer2);
  // ============ SIGNAL ============
  private isBrowser=signal(false);
  protected isLoaded=signal(false);
  protected loadError =signal<string | null>(null);

  // ✅ Computed signals pour l'efficacité
  slotId = computed(() => `slot-${this.zoneId}`);
  isReady = computed(() => this.isBrowser() && !this.loadError());
  // ✅ Références pour le cleanup
  private scriptElements: HTMLScriptElement[] = [];

  /**
   *
   */
  constructor() {
    effect(() => {
      if (this.isBrowser() && this.zoneId && this.appId) {
        this.injectMoneytizerScripts();
      }
    });

  }
  ngOnDestroy(): void {
   this.cleanupScripts();
  }
  cleanupScripts() {
    this.scriptElements.forEach(script => {
      if (script.parentElement) {
        this.renderer.removeChild(script.parentElement, script);
      }
      // Nettoyer les event listeners
      script.removeEventListener('error', () => { /* empty */ });
    });

    this.scriptElements = [];

    // ✅ Nettoyer le container
    const container = this.adContainer?.nativeElement;
    if (container) {
      this.renderer.setProperty(container, 'innerHTML', '');
    }

    this.isLoaded.set(false);
    this.loadError.set(null);
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    // if(this.isBrowser()){
    //    this.injectMoneytizerScripts();
    // }
  }
  private injectMoneytizerScripts() {
    if (this.isLoaded()) return;
    try{
      const parentElement = this.adContainer?.nativeElement;
      if (!parentElement) {
        this.loadError.set('Container non trouvé');
        return;
      }

      this.renderer.setProperty(parentElement, 'innerHTML', '');
       const script1 = this.createScript(
        `//ads.themoneytizer.com/s/gen.js?type=${this.zoneId}`,
        'script-moneytizer-gen'
      );

      const script2 = this.createScript(
        `//ads.themoneytizer.com/s/requestform.js?siteId=${this.appId}&formatId=${this.zoneId}`,
        'script-moneytizer-form'
      );

      this.renderer.appendChild(parentElement, script1);
      this.renderer.appendChild(parentElement, script2);

      this.scriptElements.push(script1, script2);
      this.isLoaded.set(true);

    }
    catch(error){
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      this.loadError.set(errorMsg);
      console.error('Erreur lors de l\'injection des scripts Moneytizer:', error);
    }

  }
  private createScript(src: string, id: string):HTMLScriptElement {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', src);
    this.renderer.setAttribute(script, 'async', 'true');
    this.renderer.setAttribute(script, 'id', id);
    this.renderer.setAttribute(script, 'defer', 'true'); // ✅ defer au lieu de async

    // ✅ Gestion des erreurs de chargement
    script.addEventListener('error', () => {
      this.loadError.set(`Erreur de chargement: ${src}`);
    });

    return script;
  }

}
