import { VideoService } from '@wkpcamer/actions';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ArticleDetail, SportDetail, VideoDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { VideoListComponent } from "../../shared/components/video-list/video-list.component";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { SocialMedia } from "../../shared/components/social-media/social-media";
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-video',
  imports: [
    DataViewModule, CardModule, RouterModule, CommonModule, ButtonModule,
    DividerModule, TagModule,
    VideoListComponent,
    AdsenseComponent,
    ViralizeAdComponent,
    DebatDroitComponent,
    SocialMedia
],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit,AfterViewInit{

  //listVideos=signal<VideoDetail[]>([]);
  listVideos=signal<VideoDetail[]>([]);
  isBrowser=signal(false);
  label=signal('');
  sports=signal<SportDetail[]>([]);

  //sportBehaviorService=inject(SportBehaviorService);
  platformId = inject(PLATFORM_ID);
  private readonly activatedRoute=inject(ActivatedRoute);
  private readonly videoService=inject(VideoService);
  private readonly taboolaService=inject(TaboolaService)
  private readonly router=inject(Router);

  /**
   *
   */
  constructor() {
     this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        this.taboolaService.newPageLoad();
        this.loadTaboolaWidget(event.urlAfterRedirects);
      });

  }

  cdr=inject(ChangeDetectorRef);
  rubriqueArticles=signal<ArticleDetail[]>([]);
  ngOnInit(): void {
     this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.listVideos.set(data['videoList']);
        const videoLabel = this.listVideos()[0].typevideo === 'Camer' ? 'vidéo Camer' : 'vidéo Sopie Prod';
        this.label.set(videoLabel);
        this.cdr.detectChanges();
      }
    })

  }
  ngAfterViewInit(): void {
     this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;

  }

  private loadTaboolaWidget(url: string) {
    this.taboolaService.setPageDetails('article', url);
    this.taboolaService.loadWidget(
      'thumbnails-a',
      'taboola-below-article-thumbnails',
      'Below Article Thumbnails',
      'mix'
    );

  }

}
