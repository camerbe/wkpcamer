import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  renderer!: Renderer2;
  scripts: { [key: string]: Observable<any> } = {};
  isBrowser=signal(false);

  rendererFactory=inject(RendererFactory2) ;
  document =inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  /**
   *
   */
  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isBrowser.set(isPlatformBrowser(this.platformId));

  }
  loadScript(name: string, src: string): Observable<any> {

    if (!this.isBrowser()) {
      // Si on n’est pas dans le navigateur, on ne fait rien
      console.warn(`[ScriptLoaderService] Script "${name}" non chargé (non-browser environnement).`);
      return new Observable(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    if (this.scripts[name]) {
      return this.scripts[name];
    }
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;

    const loadSubject = new Subject<any>();
    this.scripts[name] = loadSubject.asObservable();

    script.onload = () => {
      loadSubject.next(true);
      loadSubject.complete();
    };
    script.onerror = (error: any) => {
      loadSubject.error(error);
      loadSubject.complete();
    };
    this.renderer.appendChild(this.document.body, script);
    return this.scripts[name];
  }

  executeInlineScript(scriptContent: string, targetElement: HTMLElement): void {

    if (!this.isBrowser()) {
      console.warn('[ScriptLoaderService] Exécution de script ignorée (non-browser environnement).');
      return;
    }

    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = scriptContent;
    this.renderer.appendChild(targetElement, script);
  }
}
