import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { SlugifyService } from '../../services/slugify.service';
import { Router, RouterModule } from '@angular/router';
import { CanonicalService } from '../../services/canonical.service';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLdService } from '../../services/json-ld.service';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface ArticleViewModel {
  article: ArticleDetail;
  navigationPath: string;
  position: number;
  imageAlt: string;
  imageTitle: string;
  keywords: string;
  wordCount: number;
  flagUrl: string;
  severity: 'warn' | 'info';
}

@Component({
  selector: 'app-author-search',
  imports: [
    DataViewModule,
    CardModule,
    NgOptimizedImage,
    RouterModule,
    DatePipe,
    CommonModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './author-search.component.html',
  styleUrl: './author-search.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorSearchComponent implements OnInit , AfterViewInit{


  private readonly articleService = inject(ArticleService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly slugifyService=inject(SlugifyService);
  private readonly router=inject(Router);
  private canonicalService=inject(CanonicalService);
  private titleService=inject(Title);
  private metaService=inject(Meta);
  private jsonLdService=inject(JsonLdService);

  /*************SIGNAL ******** */
  private readonly isBrowser = signal(false);
  protected readonly isLoading = signal(true);
  //protected readonly articles = signal<ArticleViewModel[]>([]);
  protected readonly dateModif= signal('');
  private readonly baseUrl = signal('');
  protected readonly logoUrl = signal('');

  /******************INPUT */
  readonly articles = input.required<ArticleDetail[]>();
  readonly authorName = input.required<string>();
  protected readonly hasPaginator = computed(() => this.articles()?.length > 10);

  protected articleViewModels = computed(() => {
    return this.articles().map(article => ({
      article,
      navigationPath: `/${this.slugifyService.slugify(article.rubrique.rubrique)}/${this.slugifyService.slugify(article.sousrubrique.sousrubrique)}/${article.slug}`,
      imageAlt: `${article.countries.pays} :: ${article.titre}`,
      imageTitle: `${article.countries.pays} :: ${article.titre}`,
      imageWidth: article.image_width || 500,
      imageHeight: article.image_height || 500,
      keywords: this.getKeywordsArray(article.keyword),
      wordCount: this.wordCount(article.info) ,
      flagUrl: this.getFlag(article),
      severity: this.wordCount(article.info) > 1000 ? 'warn' : 'info'
    }));
  });


  private wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;

  }
  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }
  ngAfterViewInit(): void {
    if (!this.isBrowser() || !this.articles()?.length) return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.setupJsonLd());
    } else {
      requestAnimationFrame(() => this.setupJsonLd());
    }
  }
  private setupJsonLd(): void {
    const jsonLdArticles = this.articles().slice(0, 10);
    const today = new Date().toISOString().slice(0, 19) + '+00:00';

    const listElements = jsonLdArticles.map((article, index) => {
      const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';
      const year = new Date(article.dateparution).getFullYear();
      const articleUrl = `${this.baseUrl()}/${article.rubrique.rubrique.toLowerCase()}/${article.sousrubrique.sousrubrique.toLowerCase()}/${article.slug}`;

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
          },
          "headline": article.titre,
          "description": article.chapeau,
          "articleSection": `${article.rubrique.rubrique} / ${article.sousrubrique.sousrubrique}`,
          "keywords": article.keyword.split(',').map(k => k.trim()),
          "inLanguage": "fr-FR",
          "url": articleUrl,
          "datePublished": articleDate,
          "dateModified": today,
          "isAccessibleForFree": "True",
          "copyrightYear": year,
          "author": { "@type": "Person", "name": article.auteur },
          "editor": { "@type": "Person", "name": article.source },
          "publisher": {
            "@type": "Organization",
            "name": "Camer.be",
            "url": "https://www.camer.be",
            "logo": {
              "@type": "ImageObject",
              "url": this.logoUrl,
              "width": 190,
              "height": 52
            }
          },
          "image": {
            "@type": "ImageObject",
            "url": article.image_url,
            "width": article.image_width,
            "height": article.image_width,
            "caption": `${article.countries.pays} :: ${article.titre} - Camer.be`
          },
          "contentLocation": {
            "@type": "Place",
            "name": article.countries.pays
          },
          "articleBody": article.info,
          "interactionStatistic": [{
            "@type": "InteractionCounter",
            "interactionType": {
              "@type": "http://schema.org/ReadAction"
            },
            "userInteractionCount": article.hit
          }],
          "sameAs": [
            "https://www.facebook.com/camergroup",
            "https://x.com/camerbe"
          ]
        }
      };
    });

    const jsonLdGlobal = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": this.titleService.getTitle(),
      "description": this.metaService.getTag('name=description')?.content,
      "url": `${this.baseUrl()}${this.router.url}`,
      "mainContentOfPage": {
        "@type": "ItemList",
        "itemListElement": listElements
      }
    };

    this.jsonLdService.setJsonLd([jsonLdGlobal]);
  }
  ngOnInit(): void {
     if(!this.isBrowser()) return;
     this.initializeBaseUrl();
     this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
      if (this.articles()?.length > 0) {
        this.setupMetaTags();
        this.setupCanonicalUrls();
      }

  }
  private setupCanonicalUrls() {
     const currentUrl = `${this.baseUrl()}${this.router.url}`;
     this.canonicalService.setCanonicalURL(currentUrl);
    this.canonicalService.setAmpCanonicalURL(`${this.baseUrl()}/amp${this.router.url}`);
  }
  private setupMetaTags() {
    const tmpTitre =`Actualités Cameroun, Info & Analyse – Politique, Sport, Diaspora, Les articles de ${this.articles()[0].auteur}.| Camer.be`;
    const dynamicDescription = `Camer.be: Info claire et nette sur le Cameroun et la Diaspora. `;
    const finalDescription = dynamicDescription.substring(0, 155).trim();
    const logoUrl = `${this.baseUrl()}/assets/images/logo.png`;
    const currentUrl = `${this.baseUrl()}${this.router.url}`;
    //console.log('currentUrl:', currentUrl);

    // Batch update pour réduire les reflows
    this.titleService.setTitle(tmpTitre);

    this.metaService.addTags([
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: `actualités cameroun en direct, info cameroun dernière minute, politique cameroun, sport camerounais, lions indomptables, diaspora camerounaise, économie cameroun, Douala, Yaoundé, revue de presse camerounaise, investir au cameroun ` },

      // Open Graph
      { property: 'og:title', content: tmpTitre },
      { property: 'og:description', content: finalDescription },
      { property: 'og:image', content: logoUrl },
      { property: 'og:image:alt', content: tmpTitre },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:locale:alternate', content: 'en-us' },
      { property: 'og:site_name', content: 'Camer.be' },

      // Twitter
      { name: 'twitter:title', content: tmpTitre },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: logoUrl },
      { name: 'twitter:image:alt', content: tmpTitre },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@camer.be' },
      { name: 'twitter:creator', content: '@camerbe' },
      { name: 'twitter:url', content: currentUrl }
    ]);
  }
  private initializeBaseUrl() {
    if (typeof window !== 'undefined') {
      const base = `${window.location.protocol}//${window.location.host}`;
      this.baseUrl.set(base);
      this.logoUrl.set(`${base}/assets/images/camer-logo.png`);
    }
  }
  protected getKeywordsArray(keyword: string): string {
    return keyword
      ? keyword.split(',').map(k => k.trim()).join(', ')
      : '';
  }

  private getFlag(article:ArticleDetail): string {
    const countryCode = article.fkpays.toLowerCase();
    switch (countryCode) {
      case 'f': return `https://flagcdn.com/16x12/au.webp`;
      case 'zz': return `https://flagcdn.com/16x12/un.webp`;
      default: return `https://flagcdn.com/16x12/${countryCode}.webp`;
    }

  }
  protected trackBySlug(_index: number, item: ArticleViewModel): string {
    return  `${_index}-${item.article.slug}`;
  }

}
