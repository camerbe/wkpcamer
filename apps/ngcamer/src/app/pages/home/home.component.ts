import { Component, inject, LOCALE_ID, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataViewModule  } from "primeng/dataview";
import { CardModule } from "primeng/card";
import { SlugifyService } from '../../shared/services/slugify.service';
import { CommonModule, DatePipe, NgOptimizedImage, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DeviceDetectorService } from '@wkpcamer/services';
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { isPlatformBrowser } from '@angular/common';

registerLocaleData(localeFr);
@Component({
  selector: 'app-home',
  imports: [DataViewModule, CardModule, NgOptimizedImage, RouterModule, DatePipe, CommonModule,ButtonModule,TagModule ],
  providers: [

    { provide: LOCALE_ID, useValue: 'fr-FR' },

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{


  private first!:number;

  listIndex=signal<ArticleDetail[]>([]);
  listCamer=signal<ArticleDetail[]>([]);
  listOther=signal<ArticleDetail[]>([]);
  layout: 'grid' | 'list' = 'grid';
  isDesktop=signal(false);
  isBrowser=signal(false);
  //hostProtocol=signal(string)('');

  articleService=inject(ArticleService);
  activatedReoute=inject(ActivatedRoute);
  slugifyService=inject(SlugifyService);
  deviceDetectorService=inject(DeviceDetectorService);
  platformId = inject(PLATFORM_ID);

  /**
   *
   */
  // constructor(private breakpointObserver: Break
  //   pointObserver) {
  //   this.breakpointObserver.observe(['(min-width: 1024px)']).subscribe(result => {
  //     if (result.matches) {
  //       this.isDesktop.set(true);
  //     } else {
  //       this.isDesktop.set(false);
  //     }
  //   });

  // }

  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;
    this.isDesktop.set(this.deviceDetectorService.checkDesktop());
    //console.log("isDesktop",this.isDesktop());
    this.activatedReoute.data.subscribe({
      next:(data)=>{
        this.listIndex.set(data["accueilList"]);
        this.listCamer.set(this.listIndex().filter(item=>item.fkpays==='CM'));
        this.listOther.set(this.listIndex().filter(item=>item.fkpays!=='CM'));
        //console.log(this.listCamer().length);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    console.log();
  }


}
