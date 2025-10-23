import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
   platformId = inject(PLATFORM_ID);
   doc = inject(DOCUMENT);
   meta = inject(Meta);

   setJsonLd(data: any): void {
    if(isPlatformBrowser(this.platformId)) {
      const json = JSON.stringify(data);
      let script = this.doc.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = this.doc.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        this.doc.head.appendChild(script);
      }
      script.textContent = json;
    }
    else {
      const json = JSON.stringify(data);
      this.meta.addTag({ name: 'json-ld', content: json });
    }
  }
}
