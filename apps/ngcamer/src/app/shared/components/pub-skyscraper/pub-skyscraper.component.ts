import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { PubService } from '@wkpcamer/actions';
import { Pub, PubDetail } from '@wkpcamer/models';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-pub-skyscraper',
  imports: [
    CardModule,
    NgOptimizedImage
],
  templateUrl: './pub-skyscraper.component.html',
  styleUrl: './pub-skyscraper.component.css'
})
export class PubSkyscraperComponent implements OnInit,AfterViewInit {
  @Input() dimension = 728;

  pub!:PubDetail;
  isBrowser=signal(false);

  pubService=inject(PubService)
  platformId = inject(PLATFORM_ID);
  cdr=inject(ChangeDetectorRef);
  /**
   *
   */
  constructor() {
   afterRenderEffect(() => {
      this.getPub();
    });

  }
  getPub(){
    return this.pubService.getRandomPub(this.dimension).subscribe({
      next:(pub)=>{
        const tmpData=pub as unknown as Pub;
        this.pub=tmpData["data"] as unknown as PubDetail;
        this.cdr.detectChanges();

      }
    });
  }

  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    //this.cdr.detectChanges();
  }
  ngOnInit(): void {
     this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    
  }

  getImageUrl(pub: PubDetail): string {

      return pub.image_url.startsWith('http')
      ? pub.image_url
      : `https://www.camer.be${pub.image_url}`;
    }

}
