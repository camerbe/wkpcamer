import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

declare let adsbygoogle: unknown[];

@Injectable({
  providedIn: 'root'
})
export class AdsenseService {

  isBrowser=signal(false);
  platformId = inject(PLATFORM_ID);
  public pushAd(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(! this.isBrowser()) return;
    try {
      if (typeof adsbygoogle !== 'undefined') {
      adsbygoogle.push({});
    } else {
      console.warn('Adsense script not loaded yet.');
    }
    } catch (e) {
      console.error('Error pushing AdSense ad:', e);
    }
  }

  resetAds(): void{
     if (isPlatformBrowser(this.platformId)){
      const ads = document.querySelectorAll('ins.adsbygoogle');
       ads.forEach(ad => {
        if (ad.parentNode) {
          const parent = ad.parentNode;
          const newAd = document.createElement('ins');
          newAd.className = 'adsbygoogle';
          // Copier les attributs data-ad-client, data-ad-slot, etc.
          Array.from(ad.attributes).forEach(attr => {
            if (attr.name.startsWith('data-ad-')) {
              newAd.setAttribute(attr.name, attr.value);
            }
          });
          newAd.style.display = 'block'; // Assurez-vous que le style est conservé
          parent.replaceChild(newAd, ad);
        }
      });
      this.pushAd();
     }
  }

  public loadAdsenseScript(client: string): Promise<void>{
     this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      if (document.querySelector(`script[src*="${client}"]`)) {
        resolve(); // Script déjà chargé
        return;
      }
      const script = document.createElement('script');
      script.src =`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }
}
