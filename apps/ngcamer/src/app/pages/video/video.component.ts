import { VideoService } from '@wkpcamer/actions';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleDetail, SportDetail, VideoDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { VideoListComponent } from "../../shared/components/video-list/video-list.component";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { SportComponent } from "../../shared/components/sport/sport.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

@Component({
  selector: 'app-video',
  imports: [
    DataViewModule, CardModule, RouterModule, CommonModule, ButtonModule,
    DividerModule, TagModule,
    VideoListComponent,
    AdsenseComponent,
    SportComponent,
    ViralizeAdComponent
],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit,AfterViewInit{

  listVideos=signal<VideoDetail[]>([]);
  isBrowser=signal(false);
  label=signal('');
  sports=signal<SportDetail[]>([]);

  sportBehaviorService=inject(SportBehaviorService);
  platformId = inject(PLATFORM_ID);
  activatedRoute=inject(ActivatedRoute);
  videoService=inject(VideoService);

  cdr=inject(ChangeDetectorRef);
  rubriqueArticles=signal<ArticleDetail[]>([]);
  ngOnInit(): void {
     this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;

    this.sportBehaviorService.state$.subscribe({
      next:(data:SportDetail[])=>{
        this.sports.set(data.slice(0,10));

      }
    });
  }
  ngAfterViewInit(): void {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.listVideos.set(data['videoList']);
        const videoLabel = this.listVideos()[0].typevideo === 'Camer' ? 'vidéo Camer' : 'vidéo Sopie Prod';
        this.label.set(videoLabel);
        this.cdr.detectChanges();
      }
    })

  }

}
