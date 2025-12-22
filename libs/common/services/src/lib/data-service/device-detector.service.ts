import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal,OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService implements OnDestroy {


  platformId = inject(PLATFORM_ID);
  private isBrowser=signal(isPlatformBrowser(this.platformId));
  private userAgent=this.isBrowser() ? navigator.userAgent.toLowerCase() : '';




  readonly isMobileSignal = signal(this.checkMobile());
  readonly isTabletSignal = signal(this.checkTablet());
  readonly isDesktopSignal = signal(this.checkDesktop());

  private mediaQuery: MediaQueryList | null = null;
  private listener = (e: MediaQueryListEvent) => {
    this.isDesktopSignal.set(e.matches);
  };

  checkMobile(): boolean {
    return this.isBrowser() && /iphone|ipod|ipad|android|blackberry|mini|windows\sce|palm/i.test(this.userAgent);
  }


  checkTablet(): boolean {
    return this.isBrowser() && /ipad|android(?!.*mobile)|tablet/i.test(this.userAgent);
  }

  checkDesktop(): boolean {
    return !this.checkMobile() && !this.checkTablet();
  }
  // mediaQuery = window.matchMedia('(min-width: 1024px)');
  // listener = (e: MediaQueryListEvent) => {
  //   this.isDesktopSignal.set(e.matches);
  // };

  constructor() {
    if (this.isBrowser()) {
      this.mediaQuery = window.matchMedia('(min-width: 1024px)');
      this.mediaQuery.addEventListener('change', this.listener);
    }
    //this.mediaQuery.addEventListener('change', this.listener);
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
    this.mediaQuery.removeEventListener('change', this.listener);
  }
  }
}
