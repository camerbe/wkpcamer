import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, Component, inject, signal, AfterViewInit, ChangeDetectorRef, PLATFORM_ID, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
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
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';
//import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SocialMedia } from "../social-media/social-media";
import { ViralizeAdComponent } from "../viralize-ad/viralize-ad.component";
interface SelectedVideo {
  titre: string;
  url: string;
}
interface DataLoadResult {
  debat: Article | null;
  droit: Article | null;
  sopieVideo: Video | null;
  camerVideo: Video | null;
  event: Evenement | null;
}
@Component({
  selector: 'app-debat-droit',
  standalone: true,
  imports: [
    CardModule,
    NgOptimizedImage,
    Divider,
    RouterModule,
    ButtonModule,
    AdMoneytizerComponent,
    AdsenseComponent,
    DialogModule,
    PubSkyscraperComponent,
    ProgressSpinnerModule,
    SocialMedia,
    ViralizeAdComponent
],
  templateUrl: './debat-droit.component.html',
  //styleUrl: './debat-droit.component.css'
  styleUrls: ['./debat-droit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebatDroitComponent implements OnInit,OnDestroy {

  // Signals pour la réactivité optimale
  readonly debat = signal<ArticleDetail | null>(null);
  readonly droit = signal<ArticleDetail | null>(null);
  readonly sopie = signal<VideoDetail | null>(null);
  readonly camer = signal<VideoDetail | null>(null);
  readonly evt = signal<EventDetail | null>(null);

  isBrowser=signal(false);
  selectedVideo = signal<SelectedVideo | null>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  displayVideo = signal(false);
  isLoading = signal(true);
  hasError = signal(false);

  private readonly destroy$ = new Subject<void>();
  private readonly articleService=inject(ArticleService)
  slugifyService=inject(SlugifyService);
  private readonly videoService=inject(VideoService);
  private readonly eventService=inject(EventService);
  //cdr=inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer=inject(DomSanitizer);


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) {
      this.isLoading.set(false);
      return;
    };
     this.loadAllData();
  }
  private loadAllData() {
    const requests = {
      debat: this.articleService.getOneRubriqueArticle(27, 25).pipe(
        catchError(err => {
          console.error('❌ Erreur debat:', err);
          return of(null);
        })
      ),
      droit: this.articleService.getOneRubriqueArticle(33, 30).pipe(
        catchError(err => {
          console.error('❌ Erreur droit:', err);
          return of(null);
        })
      ),
      sopieVideo: this.videoService.getOneVideos('Sopie').pipe(
        catchError(err => {
          console.error('❌ Erreur Sopie:', err);
          return of(null);
        })
      ),
      camerVideo: this.videoService.getOneVideos('Camer').pipe(
        catchError(err => {
          console.error('❌ Erreur Camer:', err);
          return of(null);
        })
      ),
      event: this.eventService.getEvent().pipe(
        catchError(err => {
          console.error('❌ Erreur event:', err);
          return of(null);
        })
      )
    };

    forkJoin(requests)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => this.handleDataLoad(results as DataLoadResult),
        error: (err) => this.handleLoadError(err)
      });
  }
  handleLoadError(err: unknown): void {
    console.error('❌ Erreur globale de chargement:', err);
    this.hasError.set(true);
    this.isLoading.set(false);
  }
  private handleDataLoad(results: DataLoadResult): void {
    this.debat.set(this.extractData<Article, ArticleDetail>(results.debat));
    this.droit.set(this.extractData<Article, ArticleDetail>(results.droit));
    this.sopie.set(this.extractData<Video, VideoDetail>(results.sopieVideo));
    this.camer.set(this.extractData<Video, VideoDetail>(results.camerVideo));
    this.evt.set(this.extractData<Evenement, EventDetail>(results.event));

    this.isLoading.set(false);
  }
  private extractData<T, D>(data: T | null): D | null {
    if (!data) return null;
    return (data as any)['data'] as D;
  }

  gotoVideo(url: string,titre: string) {
    if(!this.isBrowser()) return;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.selectedVideo.set({ titre, url });
    this.safeVideoUrl.set(safeUrl);
    this.displayVideo.set(true);
  }
  protected closeVideo(): void {
    this.displayVideo.set(false);
    // Nettoyer après la fermeture pour libérer la mémoire
    setTimeout(() => {
      this.selectedVideo.set(null);
      this.safeVideoUrl.set(null);
    }, 300); // Attendre la fin de l'animation
  }
  protected onDisplayVideoChange(visible: boolean): void {
    if (!visible) {
      this.closeVideo();
    } else {
      this.displayVideo.set(visible);
    }
  }
}
