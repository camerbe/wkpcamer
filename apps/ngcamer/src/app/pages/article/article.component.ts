import { JsonLdService } from './../../shared/services/json-ld.service';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { Article, ArticleDetail, SportDetail } from '@wkpcamer/models';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, Injector, LOCALE_ID, OnDestroy, OnInit, PLATFORM_ID, signal, viewChild, ViewChild, ViewContainerRef,afterNextRender  } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DatePipe, isPlatformBrowser, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScrollTopModule } from 'primeng/scrolltop';
import { DividerModule } from 'primeng/divider';
import localeFr from '@angular/common/locales/fr';
import { ArticleMetaService } from '../../shared/services/article-meta.service';
import { CanonicalService } from '../../shared/services/canonical.service';
import { SlugifyService } from '../../shared/services/slugify.service';
import { RelatedArticlesComponent } from "../../shared/components/related-articles/related-articles.component";
import { MostReadedRubriqueCountryComponent } from "../../shared/components/most-readed-rubrique-country/most-readed-rubrique-country.component";
import { TagModule } from 'primeng/tag';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter, shareReplay, switchMap, tap } from 'rxjs';
import { AdMoneytizerComponent } from "../../shared/components/ad-moneytizer/ad-moneytizer.component";
import { AdsenseComponent } from '../../shared/components/adsense/adsense.component';
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";
import { DisqusComponent } from '../../shared/components/disqus/disqus.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

registerLocaleData(localeFr);

@Component({
  selector: 'app-article',
  imports: [
    CardModule,
    NgOptimizedImage,
    ScrollTopModule,
    DividerModule,
    RelatedArticlesComponent,
    MostReadedRubriqueCountryComponent,
    TagModule,
    AdMoneytizerComponent,
    DebatDroitComponent,
    ViralizeAdComponent,
    DisqusComponent,
    RouterModule
],
providers: [
    DatePipe, // ✅ CRITIQUE: Fournir DatePipe
    { provide: LOCALE_ID, useValue: 'fr-FR' } // ✅ Optionnel: définir la locale
],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements OnInit,AfterViewInit{



  //@ViewChild('articleContentContainer', { static: false })

  articleContentContainer = viewChild<ElementRef<HTMLDivElement>>('articleContentContainer');

  //articleContentContainer!: ElementRef<HTMLDivElement>;

  // ✅ Signals pour réactivité optimale
  readonly article = signal<ArticleDetail | null>(null);
  readonly relatedArticles = signal<ArticleDetail[]>([]);
  readonly mostReadeArticles = signal<ArticleDetail[]>([]);
  readonly sports = signal<SportDetail[]>([]);
  readonly isBrowser = signal(false);
  readonly keyWord = signal('');
  readonly articleUrl = signal('');
  readonly logoUrl = signal<string | null>(null);
  readonly dateModif = signal('');

  // ✅ Computed pour wordCount (mise en cache automatique)
  readonly wordCount = computed(() => this.calculateWordCount(this.article()));

  readonly articleSection = computed(() => {
    const article = this.article();
    return article
      ? `${article.rubrique.rubrique} / ${article.sousrubrique.sousrubrique}`
      : '';
  });

  // ✅ Sanitized content avec mise en cache
  readonly sanitizedContent = computed<SafeHtml>(() => {
    const article = this.article();
    return article?.info
      ? this.sanitizer.bypassSecurityTrustHtml(article.info)
      : '';
  });
 // ✅ Image URL optimisée
  readonly imageUrl = computed(() => {
    const article = this.article();
    if (!article) return '';

    return article.image_url.startsWith('http')
      ? article.image_url
      : `https://www.camer.be${article.image_url}`;
  });

  // ✅ Image alt text
  readonly imageAlt = computed(() => {
    const article = this.article();
    return article
      ? `${article.countries.pays} :: ${article.titre}`
      : '';
  });

  // ✅ Country flag URL
  readonly countryFlagUrl = computed(() => {
    const countryCode = this.article()?.fkpays?.toLowerCase();

    if (!countryCode) {
      return ''; // or a default flag URL if preferred
    }

    const code = countryCode === 'f' ? 'au' : countryCode;
    return `https://flagcdn.com/16x12/${code}.webp`;
  });

  // ✅ Responsive image sizes
  readonly imageSizes = computed(() => {
    return '(max-width: 768px) 100vw, (max-width: 1200px) 66vw';
  });

  // ✅ Formatted date avec pipe
  readonly formattedDate = computed(() => {
    const article = this.article();
    return article
      ? this.datePipe.transform(article.dateparution, 'dd MMM yyyy HH:mm:ss', undefined, 'fr-FR')
      : '';
  });



  private mutationObserver!: MutationObserver;
  //article!:ArticleDetail;
  slug!:string;
  //relatedArticles=signal<ArticleDetail[]>([]);
  articles=signal<ArticleDetail[]>([]);

  private readonly destroyRef = inject(DestroyRef);
  private readonly articleService=inject(ArticleService);
  private readonly activatedRoute=inject(ActivatedRoute);
  readonly sanitizer=inject(DomSanitizer);
  private readonly articleMetaService=inject(ArticleMetaService);
  private readonly canonicalService=inject(CanonicalService)
  private readonly router=inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly taboolaService=inject(TaboolaService)
  private readonly keywordAndHashtagService=inject(KeywordAndHashtagService);
  private readonly jsonLdService=inject(JsonLdService);
  private readonly sportBehaviorService=inject(SportBehaviorService);
  private readonly viewContainerRef=inject(ViewContainerRef);
  private readonly injector=inject(Injector);
  private readonly datePipe = inject(DatePipe);


  private makeVideosResponsive(): void {
    const container = this.articleContentContainer()?.nativeElement;
    if (!container) return;

    const iframes = container.querySelectorAll<HTMLIFrameElement>(
      'iframe[src*="youtube.com"], iframe[src*="youtu.be"]'
    );

    iframes.forEach((iframe) => {
      // Éviter le double wrapping
      if (iframe.parentElement?.classList.contains('yt-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.classList.add(
        'yt-wrapper',
        'aspect-video',   // ← ratio 16:9 natif CSS
        'w-full',
        'relative',
        'overflow-hidden',
        'bg-black',
        'my-4',
        'rounded-lg'
      );
      wrapper.style.paddingBottom = '56.25%'; // fallback si aspect-video non dispo

      iframe.classList.add(
        'absolute',
        'inset-0',        // ← top-0 left-0 right-0 bottom-0 en une classe
        'w-full',
        'h-full'
      );
      iframe.removeAttribute('width');
      iframe.removeAttribute('height');
      iframe.setAttribute('allowfullscreen', 'true');

      iframe.parentNode?.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);
    });
  }
  /**
   *
   */

  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));

    effect(() => {
      const article = this.article();
      if (article && this.isBrowser()) {
        afterNextRender(
          () => this.makeVideosResponsive(),
          { injector: this.injector }
        );
      }
    });

    this.activatedRoute.params
    .pipe(
      tap(() => {
        // 🔥 Réinitialiser immédiatement
        this.article.set(null);
        this.relatedArticles.set([]);
        this.mostReadeArticles.set([]);
      }),
      switchMap(() => this.activatedRoute.data),
      takeUntilDestroyed()
    )
    .subscribe({
      next: (data) => {
        const article = data['articleSlug'] as ArticleDetail;
        if (article) {
          this.article.set(article);
        }
      },
      error: (err) => console.error('Error loading article:', err)
    });

   
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        this.taboolaService.newPageLoad();
        this.loadTaboolaWidget(event.urlAfterRedirects);
      });


    effect(() => {
      const article = this.article();
      if (article && this.isBrowser()) {
        this.updateMetaAndCanonical(article);
        this.loadRelatedContent(article);
      }
    });
  }
  private  loadRelatedContent(article: ArticleDetail) {
    this.articleService.getSameRubrique(article.fksousrubrique)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        shareReplay(1) // ✅ Cache le résultat
      )
      .subscribe({
        next: (data) => {
          const tmpData = data as unknown as Article;
          const filteredTmpData = tmpData["data"] as unknown as ArticleDetail[];
          this.relatedArticles.set(
            filteredTmpData.filter(f => f.slug !== article.slug)
          );
        }
      });

    // Articles les plus lus
    this.articleService.getMostReadRubriqueByCountry(
      article.fksousrubrique,
      article.fkpays
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        shareReplay(1) // ✅ Cache le résultat
      )
      .subscribe({
        next: (data) => {
          const tmpData = data as unknown as Article;
          this.mostReadeArticles.set(tmpData["data"] as unknown as ArticleDetail[]);
        }
      });
  }
  private updateMetaAndCanonical(article: ArticleDetail) {
    this.articleMetaService.updateArticleMeta(article);
    this.keyWord.set(this.keywordAndHashtagService.removeHashtags(article.keyword));

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const currentUrl = `${baseUrl}${this.router.url}`;

    this.articleUrl.set(currentUrl);
    this.canonicalService.setCanonicalURL(currentUrl);
    this.canonicalService.setAmpCanonicalURL(`${baseUrl}/amp${this.router.url}`);
    this.logoUrl.set(`${baseUrl}/assets/images/camer-logo.png`);
  }
   /**
   *
   */
  ngOnInit(): void {

     if (!this.isBrowser()) return;

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

  ngAfterViewInit(): void {
    if (!this.isBrowser()) return;

    this.setupAdAfterFirstParagraph();
    this.loadTaboolaWidget(this.articleUrl());
    this.updateJsonLd();


  }
  private updateJsonLd() {
    const article = this.article();
    if (!article) return;

    const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';
    const today = new Date().toISOString().slice(0, 19) + '+00:00';
    const year = new Date(article.dateparution).getFullYear();
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}${this.router.url}`
      },
      "headline": article.titre,
      "description": article.chapeau,
      "articleSection": {
        "@value": `${article.rubrique.rubrique} / ${article.sousrubrique.sousrubrique}`,
        "@language": "fr-FR"
      },
      "keywords": article.keyword.split(',').map(k => k.trim()),
      "inLanguage": "fr-FR",
      "url": `${baseUrl}${this.router.url}`,
      "datePublished": articleDate,
      "dateModified": today,
      "isAccessibleForFree": "True",
      "copyrightYear": year,
      "author": {
        "@type": "Person",
        "name": article.auteur,
      },
      "editor": {
        "@type": "Person",
        "name": article.source
      },
      "publisher": {
        "@type": "Organization",
        "name": "camer.be",
        "url": "https://www.camer.be",
        "logo": {
          "@type": "ImageObject",
          "url": this.logoUrl(),
          "width": 190,
          "height": 52
        }
      },
      "image": [{
        "@type": "ImageObject",
        "url": article.image_url,
        "width": article.image_width,
        "height": article.image_height,
        "caption": `${article.countries.pays} :: ${article.titre} - Camer.be`
      }],
      "contentLocation": {
        "@type": "Place",
        "name": article.countries.pays
      },
      "articleBody": article.info,
      "wordCount": {
        "@type": "QuantitativeValue",
        "value": this.wordCount(),
        "unitText": "Words"
      },
      "interactionStatistic": [{
        "@type": "InteractionCounter",
        "interactionType": { "@type": "ReadAction" },
        "userInteractionCount": article.hit
      }],
      "sameAs": [
        "https://www.facebook.com/camergroup",
        "https://x.com/camerbe"
      ],
    };

    this.jsonLdService.setJsonLd(jsonLd);
  }

  private calculateWordCount(article: ArticleDetail | null): number {
    if (!article?.info) return 0;
    if (!this.isBrowser) return 0;
    // Cache le résultat pour éviter les recalculs
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.info, 'text/html');
    const text = doc.body.textContent || '';

    return text
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .length;
  }
  protected setupAdAfterFirstParagraph() {
    const container = this.articleContentContainer()?.nativeElement;
    if (!container) return;

    // Vérification immédiate
    if (container.querySelectorAll('p').length > 0) {
      this.insertAdAfterFirstParagraph();
      return;
    }

    // ✅ MutationObserver avec auto-cleanup
    this.mutationObserver = new MutationObserver(() => {
      if (container.querySelectorAll('p').length > 0) {
        this.insertAdAfterFirstParagraph();
        this.mutationObserver?.disconnect();
      }
    });

    this.mutationObserver.observe(container, {
      childList: true,
      subtree: true
    });
  }
  private insertAdAfterFirstParagraph() {
    const container = this.articleContentContainer()?.nativeElement;
    if (!container) return;

    const paragraphs = container.querySelectorAll('p');

    if (paragraphs.length < 2) return;

    const placeholder = document.createElement('div');
    paragraphs[1].insertAdjacentElement('afterend', placeholder);

    const adRef = this.viewContainerRef.createComponent(AdsenseComponent, {
      injector: this.injector
    });

    adRef.setInput('adClient', 'ca-pub-8638642715460968');
    adRef.setInput('adSlot', '6927429462');
    adRef.setInput('adFormat', 'auto');
    adRef.setInput('fullWidthResponsive', true);

    adRef.changeDetectorRef.detectChanges();
    placeholder.replaceWith(adRef.location.nativeElement);

  }


  protected getImageUrl(article: ArticleDetail): string{
  return article.image_url.startsWith('http')
    ? article.image_url
    : `https://www.camer.be${article.image_url}`;
  }


}
