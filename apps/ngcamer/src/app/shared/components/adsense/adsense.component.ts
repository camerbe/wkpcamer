import { AfterViewInit, Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AdsenseService } from '../../services/adsense.service';

import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-adsense',
  imports: [],
  templateUrl: './adsense.component.html',
  styleUrl: './adsense.component.css'
})
export class AdsenseComponent implements OnInit,AfterViewInit{

  @Input() adClient = 'ca-pub-8638642715460968';
  @Input() adSlot= 'YYYYYYYYYY';
  @Input() adFormat= 'auto';
  @Input() fullWidthResponsive= true;

   isBrowser=signal(false);
  adsenseService=inject(AdsenseService)
  platformId = inject(PLATFORM_ID);



  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    //  if(this.isBrowser()){
        // setTimeout(() => {
        //   this.adsenseService.pushAd();
        // }, 100);
    //  }

  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
      if(!this.isBrowser()) return;
    this.adsenseService.loadAdsenseScript(this.adClient).then().catch(error=>{
      console.error('Failed to load AdSense script:', error);
    });
  }

}
