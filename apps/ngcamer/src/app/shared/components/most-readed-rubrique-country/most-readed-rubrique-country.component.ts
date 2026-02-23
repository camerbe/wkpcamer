import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { OrderListModule } from 'primeng/orderlist';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SlugifyService } from '../../services/slugify.service';

interface EnrichedArticle extends ArticleDetail {
  routeUrl: string;
  imageUrl: string;
  imageAlt: string;
  imageTitle: string;
  hitDisplay: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-most-readed-rubrique-country',
  imports: [
    DataViewModule,
    CardModule,
    NgOptimizedImage,
    RouterModule,
    OrderListModule ,
    CommonModule,
    ButtonModule,
    TagModule,
    ChipModule,
    BadgeModule,
    OverlayBadgeModule

  ],
  templateUrl: './most-readed-rubrique-country.component.html',
  styleUrl: './most-readed-rubrique-country.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostReadedRubriqueCountryComponent implements OnInit{




  readonly mostReadedArticles = input<ArticleDetail[]>([]);
  private readonly slugCache = new Map<string, string>();
  // ✅ Computed pour articles avec URLs pré-calculées
  readonly articlesWithRoutes = computed<EnrichedArticle[]>(() => {
    return this.mostReadedArticles().map(article => ({
      ...article,
      routeUrl: this.buildArticleRoute(article),
      imageUrl: this.getImageUrl(article),
      imageAlt: article.titre,
      imageTitle: `${article.countries.pays} :: ${article.titre}`,
      hitDisplay: article.hit.toString(),
      ariaLabel: `Lire l'article: ${article.titre}`
    }));
  });

  // ✅ Computed pour le header
  readonly headerFlagUrl = computed(() => {
    const articles = this.mostReadedArticles();
    if (articles.length === 0) return '';

    const countryCode = articles[0].countries.idpays.toLowerCase();
    return `https://flagcdn.com/20x15/${countryCode}.png`;
  });

  readonly headerCountryName = computed(() => {
    const articles = this.mostReadedArticles();
    return articles.length > 0 ? articles[0].countries.pays : '';
  });

  readonly headerTitle = computed(() => {
    const articles = this.mostReadedArticles();
    return articles.length > 0
      ? `${articles[0].sousrubrique.sousrubrique} :: les `
      : '';
  });

  private readonly slugifyService=inject(SlugifyService);
  readonly isBrowser=signal(false);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router=inject(Router);

  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  private getImageUrl(article: ArticleDetail): string {
    return article.image_url.startsWith('http')
      ? article.image_url
      : `https://www.camer.be${article.image_url}`;
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
  }
  protected async gotoArticle(article: EnrichedArticle) :Promise<void>{
    if (!this.isBrowser()) return;

    try {
    // Normaliser le chemin (enlever le "/" initial si présent)
    const cleanPath = article.routeUrl.startsWith('/')
      ? article.routeUrl.slice(1)
      : article.routeUrl;

    // Navigation optimisée avec skipLocationChange
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    await this.router.navigate([`/${cleanPath}`]);
    } catch (error) {
      console.error('Navigation error:', error);
      // Optionnel : gestion d'erreur avec fallback
      // this.router.navigate(['/error']);
    }
  }
  private buildArticleRoute(article: ArticleDetail): string  {
    const rubriqueSlug = this.slugifyWithCache(article.rubrique.rubrique);
    const sousRubriqueSlug = this.slugifyWithCache(article.sousrubrique.sousrubrique);

    return `/${rubriqueSlug}/${sousRubriqueSlug}/${article.slug}`;
  }
  slugifyWithCache(text: string) : string {
    if (!this.slugCache.has(text)) {
      this.slugCache.set(text, this.slugifyService.slugify(text));
    }
    return this.slugCache.get(text)!;
  }
   getCountryFlagUrl(countryCode: string): string {
    if (!countryCode || countryCode.trim() === '' || countryCode.toLowerCase() === 'f') {
      return `https://flagcdn.com/16x12/au.webp`
    }
    return `https://flagcdn.com/16x12/${countryCode.toLowerCase()}.webp`;
  }
   trackBySlug(index: number, article: EnrichedArticle): string {
    return article.slug;
  }

}
