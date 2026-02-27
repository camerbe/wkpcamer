import { CanonicalService } from './../../services/canonical.service';

import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, Input, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SlugifyService } from '../../services/slugify.service';
import { Meta, Title } from '@angular/platform-browser';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { JsonLdService } from '../../services/json-ld.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


interface ArticleViewModel {
  article: ArticleDetail;
  navigationPath: string;
  position: number;
  isPriority: boolean;
  imageAlt: string;
  imageTitle: string;
  keywords: string;
  wordCount: number;
  flagUrl: string;
  severity: 'warn' | 'info';
}

interface CombinedViewModel {
  item1: ArticleViewModel;
  item2: ArticleViewModel;
}
@Component({
  selector: 'app-index',
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
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit,AfterViewInit{




  //@Input() indexArticles: ArticleDetail[] = [];
  indexArticles = input.required<ArticleDetail[]>();
  //**********************SIGNAL******************* */
  private imageSize = signal<'small' | 'medium' | 'large'>('medium');
  isBrowser = signal(false);
  dateModif=signal('');
  logoUrl = signal('');
  private baseUrl = signal('');

  private readonly PRIORITY_THRESHOLD = 4;

   //***************  INJECTION***************** */
  slugifyService=inject(SlugifyService);
  private metaService=inject(Meta);
  private titleService=inject(Title);
  private router=inject(Router);
  private platformId = inject(PLATFORM_ID);
  private keywordAndHashtagService=inject(KeywordAndHashtagService);
  private jsonLdService=inject(JsonLdService);
  private breakpointObserver=inject(BreakpointObserver);
  private canonicalService=inject(CanonicalService);

  // Computed signals pour éviter les recalculs
  listCamer = computed(() => this.indexArticles().filter(c => c.fkpays === 'CM'));
  listOther = computed(() => this.indexArticles().filter(c => c.fkpays !== 'CM'));
  combinedList = computed(() => {
    const camerList = this.listCamer();
    const otherList = this.listOther();
    const result: CombinedViewModel[] = [];

    camerList.forEach((camerItem, index) => {
      const otherItem = otherList[index];
      if (!otherItem) return;

      const position1 = index * 2;
      const position2 = index * 2 + 1;

      result.push({
        item1: this.createViewModel(camerItem, position1, 'warn'),
        item2: this.createViewModel(otherItem, position2, 'info')
      });
    });

    return result;
  });



  // Computed pour les tailles d'image
  imageSizeString = computed(() => this.getImageSize());
  sizes = computed(() => this.getSizes());


  breakpointSubscription!: Subscription;

  /**
   *
   */
  constructor() {
    this.breakpointSubscription =this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).pipe(takeUntilDestroyed())
    .subscribe(result => {
      if (result.breakpoints[Breakpoints.Handset]) {
        this.imageSize.set('small');
      } else if (result.breakpoints[Breakpoints.Tablet]) {
        this.imageSize.set('medium');
      } else if (result.breakpoints[Breakpoints.Web]) {
        this.imageSize.set('large');
      }
    });

  }


  getImageSize(): string {
    switch (this.imageSize()) {
      case 'small': return '(max-width: 600px) 100vw';
      case 'medium': return '(max-width: 1024px) 50vw';
      default: return '33vw';
    }
  }
  // Retourne une chaîne srcset valide pour NgOptimizedImage
getSrcSet(imageUrl: string): string {
  if (!imageUrl) return '';
    const baseUrl = imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl()}${imageUrl}`;
    return `${baseUrl}?w=480 480w, ${baseUrl}?w=768 768w, ${baseUrl}?w=1200 1200w`;
}

// Optionnel : pour [sizes] responsive
getSizes(): string {
  switch (this.imageSize()) {
    case 'small':
      return '100vw';
    case 'medium':
      return '(max-width: 768px) 100vw, 50vw';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
}



  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    this.initializeBaseUrl();
    this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;

    if (this.indexArticles()?.length > 0) {
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
    const tmpTitre = 'Actualités Cameroun, Info & Analyse – Politique, Sport, Diaspora | Camer.be';
    const dynamicDescription = `Camer.be: Info claire et nette sur le Cameroun et la Diaspora. À la une : ${this.indexArticles()[0].titre}.`;
    const finalDescription = dynamicDescription.substring(0, 155).trim();
    const logoUrl = `${this.baseUrl()}/assets/images/logo.png`;
    const currentUrl = `${this.baseUrl()}${this.router.url}`;
    //console.log('currentUrl:', currentUrl);

    // Batch update pour réduire les reflows
    this.titleService.setTitle(tmpTitre);

    this.metaService.addTags([
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: 'actualités cameroun en direct, info cameroun dernière minute, politique cameroun, sport camerounais, lions indomptables, diaspora camerounaise, économie cameroun, Douala, Yaoundé, revue de presse camerounaise, investir au cameroun' },

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

  private setupJsonLd(): void {
    const jsonLdArticles = this.indexArticles().slice(0, 10);
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
  private initializeBaseUrl() {
    if (typeof window !== 'undefined') {
      const base = `${window.location.protocol}//${window.location.host}`;
      this.baseUrl.set(base);
      this.logoUrl.set(`${base}/assets/images/camer-logo.png`);
    }
  }


  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;

  }

  ngAfterViewInit(): void {
    if (!this.isBrowser() || !this.indexArticles()?.length) return;

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.setupJsonLd());
    } else {
      requestAnimationFrame(() => this.setupJsonLd());
    }


  }

  // ngOnDestroy(): void {
  //   //this.breakpointSubscription.unsubscribe();
  // }
  protected getKeywordsArray(keyword: string): string {
    return keyword
      ? keyword.split(',').map(k => k.trim()).join(', ')
      : '';
  }
  protected trackByCombined(_index: number, item: CombinedViewModel): string {
    return `${item.item1.article.slug}-${item.item2.article.slug}`;
  }

  private getFlag(article:ArticleDetail): string {
    const countryCode = article.fkpays.toLowerCase();
    switch (countryCode) {
      case 'f': return `https://flagcdn.com/16x12/au.webp`;
      case 'zz': return `https://flagcdn.com/16x12/un.webp`;
      default: return `https://flagcdn.com/16x12/${countryCode}.webp`;
    }
    
  }

  private createViewModel(
    article: ArticleDetail,
    position: number,
    severity: 'warn' | 'info'
  ): ArticleViewModel {
    const slugifiedRubrique = this.slugifyService.slugify(article.rubrique.rubrique);
    const slugifiedSousrubrique = this.slugifyService.slugify(article.sousrubrique.sousrubrique);
    
    return {
      article,
      navigationPath: `/${slugifiedRubrique}/${slugifiedSousrubrique}/${article.slug}`,
      position: position + 1,
      isPriority: position < this.PRIORITY_THRESHOLD,
      imageAlt: `${article.countries.pays} :: ${article.titre}`,
      imageTitle: `${article.countries.pays} :: ${article.titre}`,
      keywords: this.getKeywordsArray(article.keyword),
      wordCount: this.wordCount(article.info),
      flagUrl: this.getFlag(article),
      severity
    };
  }
}
