import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, Component, inject, signal, AfterViewInit, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Article, ArticleDetail, Evenement, EventDetail, Video, VideoDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { CardModule } from 'primeng/card';
import { Divider } from "primeng/divider";
import { SlugifyService } from '../../services/slugify.service';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AdMoneytizerComponent } from "../ad-moneytizer/ad-moneytizer.component";
import { AdsenseComponent } from "../adsense/adsense.component";
import { EventService, VideoService } from '@wkpcamer/actions';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PubSkyscraperComponent } from "../pub-skyscraper/pub-skyscraper.component";

@Component({
  selector: 'app-debat-droit',
  imports: [
    CardModule,
    NgOptimizedImage,
    Divider,
    RouterModule,
    ButtonModule,
    AdMoneytizerComponent,
    AdsenseComponent,
    DialogModule,
    PubSkyscraperComponent
],
  templateUrl: './debat-droit.component.html',
  styleUrl: './debat-droit.component.css'
})
export class DebatDroitComponent implements AfterViewInit {


  debat!:ArticleDetail;
  droit!:ArticleDetail;
  sopie!:VideoDetail;
  camer!:VideoDetail;
  evt!:EventDetail;
  isBrowser=signal(false);
  selectedVideo: unknown;
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  displayVideo =signal(false);

  articleService=inject(ArticleService)
  slugifyService=inject(SlugifyService);
  videoService=inject(VideoService);
  eventService=inject(EventService);
  cdr=inject(ChangeDetectorRef);
  platformId = inject(PLATFORM_ID);
  sanitizer=inject(DomSanitizer);

  constructor() {
    afterRenderEffect(() => {
      this.getDebatArticle();
      this.getDroitArticle();
      this.getLatestVideo('Sopie','Sopie');
      this.getLatestVideo('Camer','Camer');
      this.getOneEvent();
    });
  }
  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

  }
  getOneEvent(){
    return this.eventService.getEvent().subscribe({
      next:(event)=>{
        const tmpData=event as unknown as Evenement;
        const evtDetail=tmpData['data'] as unknown as EventDetail;
        this.evt=evtDetail ;
        this.cdr.detectChanges();
      },      error:(err)=>{
        console.error('Error fetching event:', err);
      }
    });
  }
  getLatestVideo(videotype:string,type:'Sopie' | 'Camer'){
    return this.videoService.getOneVideos(videotype).subscribe({
      next:(videos)=>{
        const tmpData=videos as unknown as Video;
        if(type==='Sopie'){
          const sopieVideos=tmpData["data"] as unknown as VideoDetail;
          this.sopie=sopieVideos ;
        }
        if(type==='Camer'){
          const camerVideos=tmpData["data"] as unknown as VideoDetail;
          this.camer=camerVideos ;
        }
        this.cdr.detectChanges();
      }
    });
  }
  getDebatArticle(){
    return this.articleService.getOneRubriqueArticle(27,25).subscribe({
      next:(articles)=>{
        const tmpData=articles as unknown as Article;
        const debatDroitArticles=tmpData["data"] as unknown as ArticleDetail;
        this.debat=debatDroitArticles ;
        this.cdr.detectChanges();
      }
    });
  }
  getDroitArticle(){
    return this.articleService.getOneRubriqueArticle(33,30).subscribe({
      next:(articles)=>{
        const tmpData=articles as unknown as Article;
        const droitArticles=tmpData["data"] as unknown as ArticleDetail;
        this.droit=droitArticles ;
        this.cdr.detectChanges();
      }
    });
  }
  gotoVideo(url: string,titre: string) {
    if(!this.isBrowser()) return;
     const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.selectedVideo = { titre, url };
    this.safeVideoUrl.set(safeUrl);
    this.displayVideo.set(true);
  }
}
