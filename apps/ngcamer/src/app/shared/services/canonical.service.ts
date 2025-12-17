import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
   document = inject(DOCUMENT);
   setCanonicalURL(url?: string){
    const canURL = url === undefined ? this.document.URL : url;
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canURL);
    // Remove existing canonical
    const existing = this.document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }
    this.document.head.appendChild(link);
   }
}
