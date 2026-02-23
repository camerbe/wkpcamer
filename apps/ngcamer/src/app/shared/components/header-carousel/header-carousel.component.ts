import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Input, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { SlugifyService } from '../../services/slugify.service';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { PubSkyscraperComponent } from "../pub-skyscraper/pub-skyscraper.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header-carousel',
  imports: [
    CardModule,
    ButtonModule,
    CarouselModule,
    TagModule,
    DividerModule,
    CommonModule,
    NgOptimizedImage,
    RouterModule,
    PubSkyscraperComponent
],
  templateUrl: './header-carousel.component.html',
  styleUrl: './header-carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCarouselComponent   {


  // @Input() carouselArticles: ArticleDetail[] = [];
  readonly carouselArticles = input.required<ArticleDetail[]>();

  private readonly slugifyService=inject(SlugifyService);
  private readonly router=inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly breakpointObserver=inject(BreakpointObserver);
  //
  readonly isBrowser = computed(() => isPlatformBrowser(this.platformId));

  // ✅ Constantes
  private readonly RESPONSIVE_OPTIONS:CarouselResponsiveOptions[] = [
    { breakpoint: '1024px', numVisible: 4, numScroll: 1 },
    { breakpoint: '768px', numVisible: 2, numScroll: 1 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ] as const;

  private readonly IMAGE_SIZES = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';

  private readonly breakpointState = toSignal(
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]),
    { initialValue: { matches: false, breakpoints: {} } }
  );

  readonly imageSize = computed(() => {
    const state = this.breakpointState();
    const breakpoints = state.breakpoints as Record<string, boolean>;

    if (breakpoints[Breakpoints.Handset]) return 'small';
    if (breakpoints[Breakpoints.Tablet]) return 'medium';
    return 'large';
  });

  readonly responsiveOptions = computed(() => this.RESPONSIVE_OPTIONS);
  readonly getSizes = computed(() => this.IMAGE_SIZES);
  breakpointSubscription!: Subscription;


   //breakpointSubscription=inject(Subscription);
  readonly hasArticles = computed(() => this.carouselArticles().length > 0);

  /**
   *
   */
  constructor() {
    // effect(() => {
    //   console.log('Articles:', this.carouselArticles());
    //   console.log('Nombre:', this.carouselArticles().length);
    // });

  }
   gotoArticle(slug: string, rubrique: string, sousrubrique: string): void {
    const url = `/${this.slugifyService.slugify(rubrique)}/${this.slugifyService.slugify(sousrubrique)}/${slug}`;
    this.router.navigate([url]).catch(err => console.error('Navigation error:', err));;
  }

  // ✅ TrackBy typé et performant
  trackBySlug(index: number, article: ArticleDetail): string {
    return article.slug || `article-${index}`;
  }

  // getSizes(): string {
  //   return '(max-width: 768px) 100vw, 50vw';
  // }

  // ngOnDestroy(): void {
  //   this.breakpointSubscription.unsubscribe();
  // }

}
