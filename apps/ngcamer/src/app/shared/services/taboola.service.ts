import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

declare global {
  interface Window {
  _taboola: unknown[];
  }
}

interface TaboolaPageDetails {
  url: string;
  [key: string]: string;
}
@Injectable({
  providedIn: 'root'
})
export class TaboolaService {
  isBrowser=signal(false);
  platformId = inject(PLATFORM_ID);
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(this.isBrowser()){
      window._taboola = window._taboola || [];
    }

  }

  newPageLoad() {
    window._taboola.push({ notify: 'newPageLoad' });
  }

  loadWidget(mode: string, container: string, placement: string, targetType:
  string){
      window._taboola.push({
        mode: mode,
        container: container,
        placement: placement,
        target_type: targetType
      });
  }

  flush() {
    window._taboola.push({ flush: true });
  }

  setPageDetails(pageType: string, url: string) {
    const pageDetails: TaboolaPageDetails = {
    url
  };
    pageDetails[pageType] = 'auto';
    //pageDetails.url = url;
    window._taboola.push(pageDetails);
  }

}
