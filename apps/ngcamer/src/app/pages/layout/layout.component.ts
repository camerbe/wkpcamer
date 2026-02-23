import { Sport } from '@wkpcamer/models';
import {  ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, PLATFORM_ID, signal} from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ArticleService } from '@wkpcamer/services/articles';
import { ArticleForIndexService } from '../../shared/services/article-for-index.service';
import { isPlatformBrowser } from '@angular/common';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { ArticleDetail, SportDetail } from '@wkpcamer/models';
import { HeaderCarouselComponent } from "../../shared/components/header-carousel/header-carousel.component";
import { AdMoneytizerComponent } from "../../shared/components/ad-moneytizer/ad-moneytizer.component";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { AdsenseService } from '../../shared/services/adsense.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from "primeng/card";



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MegaMenuModule,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    HeaderCarouselComponent,
    AdMoneytizerComponent,
    AdsenseComponent,
    RouterOutlet,
    CardModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit,OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private articleService=inject(ArticleService);
  private articleItemsService=inject(ArticleForIndexService);
  private sportBehaviorService=inject(SportBehaviorService);
  private adsenseService=inject(AdsenseService);
  private router=inject(Router);
  private activatedRoute=inject(ActivatedRoute);



  isBrowser=signal(isPlatformBrowser(this.platformId));
   /**
   * ⚡ Signal d'état de chargement
   * Exposé au template pour afficher le skeleton
   */


  /**
   * ⚡ Signal d'état d'erreur
   * Exposé au template pour afficher les messages d'erreur
   */
  readonly hasError = signal(false);
  private rawArticles = toSignal(this.articleItemsService.state$, { initialValue: [] });
  private readonly destroy$ = new Subject<void>();

  carouselArticles:ArticleDetail[]=[];
  //filteredCarouselArticles = signal<ArticleDetail[]>([]);
  readonly filteredCarouselArticles = computed(() => {
    const data = this.rawArticles();
    //console.log('🔍 Raw articles dans computed:', data); // Debug
    return Array.isArray(data) ? data.slice(0, 20) : [];
  });
  readonly isLoading = computed(() => this.rawArticles() === null || this.rawArticles().length === 0);
  /**
   * ⚡ Computed signal : vérifie si on a des données carousel
   * Utilisé dans le template pour la logique conditionnelle
   */
  readonly hasCarouselData = computed(() =>
    this.filteredCarouselArticles().length > 0
  );

  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    // effect(() => {
    //   console.log('Articles:', this.filteredCarouselArticles());
    //   console.log('Nombre:', this.filteredCarouselArticles().length);
    //   console.log('✅ Has data:', this.hasCarouselData());
    // });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    if (!this.isBrowser()) return;

    this.setupRouterEvents();
    this.initData();
  }
  private setupRouterEvents() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.adsenseService.resetAds();
      });
  }
  private initData() {
    // Charge les articles depuis le resolver

    this.loadInitialArticles();

    // Charge les sports
    //this.loadSports();

  }
  private loadSports() {
    this.articleService.getSportArticle()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const tmpData = data as unknown as Sport[];
          const allSports = tmpData?.[0]?.data as unknown as SportDetail[] || [];

          // ⚡ Slice immédiat pour limiter les données en mémoire
          const limitedSports = allSports.length > 10
            ? allSports.slice(0, 10)
            : allSports;

          this.sportBehaviorService.updateState(limitedSports);
          //this.isLoading.set(false);
          this.hasError.set(false);
        },
        error: (err) => {
          console.error('❌ Erreur chargement sports:', err);
          this.handleLoadingError(err);
        }
      });
  }
  private handleLoadingError(err: any) {
    //this.isLoading.set(false);
    this.hasError.set(true);
  }
  private loadInitialArticles() {
    const initialList = this.activatedRoute.snapshot.data['accueilList'];
    //console.log('🎯 Initial list from resolver:', initialList); // Debug crucial

    if (initialList && Array.isArray(initialList) && initialList.length > 0) {
      this.articleItemsService.updateState(initialList);
      console.log('✅ Articles chargés:', initialList.length);
    } else {
      console.warn('⚠️ Pas de données dans le resolver');
    }
  }



}
