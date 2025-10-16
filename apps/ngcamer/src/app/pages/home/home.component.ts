import { SportBehaviorService } from './../../shared/services/sport-behavior.service';
import { Component, inject, LOCALE_ID, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail, SportDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataViewModule  } from "primeng/dataview";
import { CardModule } from "primeng/card";
import { SlugifyService } from '../../shared/services/slugify.service';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DeviceDetectorService } from '@wkpcamer/services';
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { isPlatformBrowser } from '@angular/common';
import { IndexComponent } from "../../shared/components/index/index.component";
import { ArticleForIndexService } from '../../shared/services/article-for-index.service';
import { SportComponent } from "../../shared/components/sport/sport.component";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { DividerModule } from 'primeng/divider';
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

registerLocaleData(localeFr);
@Component({
  selector: 'app-home',
  imports: [DataViewModule, CardModule, RouterModule, CommonModule, ButtonModule,
    DividerModule, TagModule, IndexComponent, SportComponent, AdsenseComponent, ViralizeAdComponent],
  providers: [

    { provide: LOCALE_ID, useValue: 'fr-FR' },

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{


  private first!:number;

  listIndex=signal<ArticleDetail[]>([]);
  listCamer=signal<ArticleDetail[]>([]);
  listOther=signal<ArticleDetail[]>([]);
  sports=signal<SportDetail[]>([]);
  layout: 'grid' | 'list' = 'list';
  isDesktop=signal(false);
  isBrowser=signal(false);
  isData=signal(false);

  articleService=inject(ArticleService);
  activatedRoute=inject(ActivatedRoute);
  slugifyService=inject(SlugifyService);
  deviceDetectorService=inject(DeviceDetectorService);
  sportBehaviorService=inject(SportBehaviorService);
  platformId = inject(PLATFORM_ID);
  articleIndex=inject(ArticleForIndexService)

  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;
    this.isDesktop.set(this.deviceDetectorService.checkDesktop());

    this.articleIndex.state$.subscribe({
      next:(data:ArticleDetail[])=>{
        if(!data || data.length===0) {
          this.isData.set(false);
          return;
        }
        //console.log(data);
        this.listIndex.set(data);

      }
    })
    if(!this.isData()){
      this.listIndex.set(this.activatedRoute.snapshot.data['accueilList']);
      this.articleIndex.updateState(this.listIndex());

    }
    this.sportBehaviorService.state$.subscribe({
      next:(data:SportDetail[])=>{
        this.sports.set(data.slice(0,10));

      }
    });

  }


}
