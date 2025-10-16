import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdScriptService {
    renderer!: Renderer2;
    isBrowser=signal(false);
    private rendererFactory: RendererFactory2 = inject(RendererFactory2);
    platformId = inject(PLATFORM_ID);
   constructor() {
     this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    public loadScript(id: string, url: string): HTMLScriptElement | undefined {
      this.isBrowser.set(isPlatformBrowser(this.platformId));
      if(this.isBrowser()) {
        const script = this.renderer.createElement('script');
        script.id = id;
        script.src = url;
        script.async = true;
        this.renderer.appendChild(document.body, script);
        return script;
      }
      return;
    }

    public removeScript(id: string): void {
      this.isBrowser.set(isPlatformBrowser(this.platformId));
      if(this.isBrowser()) {
        const script = document.getElementById(id);
        if (script) {
          this.renderer.removeChild(document.body, script);
        }

      }
      
    }


}
