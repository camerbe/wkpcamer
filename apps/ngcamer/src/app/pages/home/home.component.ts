import { SportBehaviorService } from './../../shared/services/sport-behavior.service';
import { afterNextRender, afterRenderEffect, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, effect, inject, Injector, LOCALE_ID, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Article, ArticleDetail, SportDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataViewModule  } from "primeng/dataview";
import { CardModule } from "primeng/card";
import { SlugifyService } from '../../shared/services/slugify.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DeviceDetectorService } from '@wkpcamer/services';
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { isPlatformBrowser } from '@angular/common';
import { IndexComponent } from "../../shared/components/index/index.component";
import { ArticleForIndexService } from '../../shared/services/article-for-index.service';
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { DividerModule } from 'primeng/divider';
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { catchError, distinctUntilChanged, filter, map, of, shareReplay, tap } from 'rxjs';
import { SocialMedia } from "../../shared/components/social-media/social-media";
import { Badge } from "primeng/badge";

registerLocaleData(localeFr);
@Component({
  selector: 'app-home',
  imports: [DataViewModule, CardModule, RouterModule, CommonModule, ButtonModule,
    DividerModule, TagModule, IndexComponent, AdsenseComponent, DebatDroitComponent, SocialMedia],
  providers: [

    { provide: LOCALE_ID, useValue: 'fr-FR' },

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit,AfterViewInit{


  private first!:number;

  readonly listIndex=signal<ArticleDetail[]>([]);
  readonly listCamer=signal<ArticleDetail[]>([]);
  readonly listOther=signal<ArticleDetail[]>([]);
  readonly sports=signal<SportDetail[]>([]);
  readonly layout: 'grid' | 'list' = 'list';
  readonly isDesktop=signal(false);
  readonly isBrowser=signal(false);
  readonly isDataLoaded = signal(false);
  readonly isLoading = signal(false);

  private readonly articleService=inject(ArticleService);
  private readonly activatedRoute=inject(ActivatedRoute);
  private readonly slugifyService=inject(SlugifyService);
  private readonly deviceDetectorService=inject(DeviceDetectorService);
  private readonly sportBehaviorService=inject(SportBehaviorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly articleIndex=inject(ArticleForIndexService);
  private readonly destroyRef =inject(DestroyRef);
  private readonly injector =inject(Injector);


  readonly hasArticles = computed(() => this.listIndex().length > 0);
  readonly displayedSports = computed(() => this.sports().slice(0, 10));
  readonly shouldShowContent = computed(() =>
    this.isBrowser() && this.hasArticles()
  );

  // Configuration Adsense
  readonly adsenseConfig = {
    adClient: 'ca-pub-8638642715460968',
    adSlot: '6927429462',
    adFormat: 'auto',
    fullWidthResponsive: true
  } as const;

  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));

    effect(() => {
      this.subscribeToArticleIndex();
    }, {
      injector: this.injector,
      allowSignalWrites: true
    });

  }
  private subscribeToArticleIndex(): void {
    this.articleIndex.state$
      .pipe(
        filter((data): data is ArticleDetail[] => this.isValidArticleArray(data)),
        distinctUntilChanged((prev, curr) =>
          prev.length === curr.length &&
          prev[0]?.idarticle === curr[0]?.idarticle
        ),
        tap(() => this.isDataLoaded.set(true)),
        shareReplay({ bufferSize: 1, refCount: true }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data: ArticleDetail[]) => {
          this.listIndex.set(data);
        },
        error: (error) => {
          console.error('❌ Erreur articleIndex:', error);
          this.isDataLoaded.set(false);
        }
      });
  }
  private isValidArticleArray(data: ArticleDetail[]): boolean {
    return Array.isArray(data) && data.length > 0;
  }


  // getIndex(){
  //   return this.articleIndex.state$.subscribe({
  //     next:(data:ArticleDetail[])=>{
  //       if(!data || data.length===0) {
  //         this.isData.set(false);
  //         return;
  //       }
  //       //console.log(data);
  //       this.listIndex.set(data);
  //       this.cdr.detectChanges();
  //     }
  //   })
  // }

  ngOnInit(): void {

    if (!this.isBrowser()) return;

    this.initializeSettings();

    this.loadResolvedData();

    this.subscribeSports();

  }
  private subscribeSports() {
    this.sportBehaviorService.state$
      .pipe(
        filter((data): data is SportDetail[] =>
          Array.isArray(data) && data.length > 0
        ),
        distinctUntilChanged((prev, curr) =>
          prev.length === curr.length &&
          prev[0]?.id === curr[0]?.id
        ),
        shareReplay({ bufferSize: 1, refCount: true }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data: SportDetail[]) => {
          this.sports.set(data);
        },
        error: (error) => {
          console.error('❌ Erreur sports:', error);
        }
      });
  }
  private loadResolvedData(): void {
    const resolvedData = this.activatedRoute.snapshot.data['accueilList'];

    if (this.isValidArticleArray(resolvedData)) {
      this.listIndex.set(resolvedData);
      this.articleIndex.updateState(resolvedData);
      this.isDataLoaded.set(true);
    }
  }
  private initializeSettings() {
    this.isDesktop.set(this.deviceDetectorService.checkDesktop());
  }

  ngAfterViewInit(): void {
      if (!this.isBrowser()) return;

      afterNextRender(() => {
        this.refreshArticles();
      }, {
      injector: this.injector
    });
  }
  private refreshArticles() : void {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    this.articleService.getArticle()
      .pipe(
        map((response) => this.extractArticles(response)),
        filter((articles): articles is ArticleDetail[] =>
          this.isValidArticleArray(articles)
        ),
        tap((articles) => {
          this.updateArticles(articles);
        }),
        catchError((error) => {
          console.error('❌ Erreur rafraîchissement:', error);
          this.isLoading.set(false);
          this.isDataLoaded.set(false);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
 private  updateArticles(articles: ArticleDetail[]) {
    this.listIndex.set(articles);
    this.articleIndex.updateState(articles);
    this.isDataLoaded.set(true);
    this.isLoading.set(false);
 }
  private extractArticles(response: Article[]): any {
    try {
      const article = response as unknown as Article;
      return article['data'] as unknown as ArticleDetail[];
    } catch {
      return null;
    }
  }

  trackByArticleId(index: number, article: ArticleDetail): string | number {
    return article.idarticle ?? index;
  }

  trackBySportId(index: number, sport: SportDetail): string | number {
    return sport.id ?? index;
  }

  protected reloadArticles(): void {
    this.isDataLoaded.set(false);
    this.refreshArticles();
  }

}
