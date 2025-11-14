import { JsonLdService } from './../../shared/services/json-ld.service';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { Article, ArticleDetail, SportDetail } from '@wkpcamer/models';
import { AfterViewInit, Component, ElementRef, inject, Injector, OnInit, PLATFORM_ID, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DatePipe, isPlatformBrowser, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
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
import { SportComponent } from "../../shared/components/sport/sport.component";
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter } from 'rxjs';
import { AdMoneytizerComponent } from "../../shared/components/ad-moneytizer/ad-moneytizer.component";
import { AdsenseComponent } from '../../shared/components/adsense/adsense.component';
import { PubSkyscraperComponent } from "../../shared/components/pub-skyscraper/pub-skyscraper.component";
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

registerLocaleData(localeFr);

@Component({
  selector: 'app-article',
  imports: [
    CardModule,
    NgOptimizedImage,
    DatePipe,
    ScrollTopModule,
    DividerModule,
    RelatedArticlesComponent,
    MostReadedRubriqueCountryComponent,
    TagModule,
    SportComponent,
    AdMoneytizerComponent,
    DebatDroitComponent,
    ViralizeAdComponent
],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit,AfterViewInit{


  @ViewChild('articleContentContainer', { static: false })
  articleContentContainer!: ElementRef<HTMLDivElement>;
  mutationObserver!: MutationObserver;
  article!:ArticleDetail;
  slug!:string;
  relatedArticles=signal<ArticleDetail[]>([]);
  articles=signal<ArticleDetail[]>([]);
  mostReadeArticles=signal<ArticleDetail[]>([]);
  isBrowser=signal(false);
  sports=signal<SportDetail[]>([]);
  keyWord=signal('');
  dateModif=signal('');

  articleService=inject(ArticleService);
  activatedRoute=inject(ActivatedRoute);
  sanitizer=inject(DomSanitizer);
  articleMetaService=inject(ArticleMetaService);
  canonicalService=inject(CanonicalService)
  router=inject(Router);
  slugifyService=inject(SlugifyService);
  platformId = inject(PLATFORM_ID);
  taboolaService=inject(TaboolaService)
  keywordAndHashtagService=inject(KeywordAndHashtagService);
  jsonLdService=inject(JsonLdService);
  sportBehaviorService=inject(SportBehaviorService);
  viewContainerRef=inject(ViewContainerRef);
  injector=inject(Injector);

  ngOnInit(): void {
    this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    this.slug=this.activatedRoute.snapshot.params["slug"];
    //this.article=this.activatedRoute.snapshot.data['articleSlug'] ;
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.article=data['articleSlug'] as ArticleDetail;
      }
    });
    //console.log(`onInit :${this.article.hit}`);
    this.articleMetaService.updateArticleMeta(this.article);
    this.keyWord.set(this.keywordAndHashtagService.removeHashtags(this.article.keyword));
    this.canonicalService.setCanonicalURL(`${window.location.protocol}//${window.location.host}${this.router.url}`)

     this.articleService.getSameRubrique(this.article.fksousrubrique).subscribe({
        next:(data)=>{
          const tmpData=data as unknown as Article;
          const filteredTmpData=tmpData["data"] as unknown as ArticleDetail[];
          this.relatedArticles.set(filteredTmpData.filter(f=>f.slug!==this.article.slug));
        }
     });
     this.articleService.getMostReadRubriqueByCountry(this.article.fksousrubrique,this.article.fkpays).subscribe({
      next:(data)=>{
        const tmpData=data as unknown as Article;
        this.mostReadeArticles.set(tmpData["data"] as unknown as ArticleDetail[]);
        //console.log(this.mostReadeArticles());
      }
     });

     this.sportBehaviorService.state$.subscribe({
      next:(data:SportDetail[])=>{
        this.sports.set(data.slice(0,10));

      }
    })

    this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).subscribe((event:NavigationEnd)=>{
        this.taboolaService.newPageLoad();
        this.loadTaboolaWidget(event.urlAfterRedirects);
    });
  }
  loadTaboolaWidget(url: string) {
    this.taboolaService.setPageDetails(
      'article',
      `${window.location.protocol}//${window.location.host}${url}`
    );
    this.taboolaService.loadWidget(
      'thumbnails-a',
      'taboola-below-article-thumbnails',
      'Below Article Thumbnails',
      'mix'
    );

    this.taboolaService.flush();
  }
  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    this.setupAdAfterFirstParagraph();
    this.loadTaboolaWidget(this.router.url);
    const articleDate = new Date(this.article.dateparution).toISOString().slice(0, 19) + '+00:00';
    const date =new Date(Date.now());
     const today=date.toISOString().slice(0, 19) + '+00:00';
     const year = new Date(this.article.dateparution).getFullYear();
    const jsonLd={
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.protocol}//${window.location.host}${this.router.url}`
      },
      "headline": this.article.titre,
       "description": this.article.chapeau,
       "articleSection":{
        "@value": `${this.article.rubrique.rubrique} / ${this.article.sousrubrique.sousrubrique}`,
        "@language": "fr-FR"
       },
       "keywords": this.article.keyword.split(',').map(k => k.trim()),
       "inLanguage": "fr-FR",
       "url": `${window.location.protocol}//${window.location.host}${this.router.url}`,
       "datePublished": articleDate,
       "dateModified": today,
       "isAccessibleForFree": "True",
       "copyrightYear": year,
       "author": {
        "@type": "Person",
        "name": this.article.auteur,
       },
       "editor": {
          "@type": "Person",
          "name": this.article.source
       },
       "publisher": {
          "@type": "Organization",
          "name": "camer.be",
          "url": "https://www.camer.be",
          "logo": {
            "@type": "ImageObject",
            "url":`${window.location.protocol}//${window.location.host}/assets/images/camer-logo.png`,
            "width": 190,
            "height": 52
          }
        },
        "image": [
        {
          "@type": "ImageObject",
          "url": this.article.image_url,
          "width": this.article.image_width,
          "height": this.article.image_height,
          "caption": `${this.article.countries.pays} :: ${this.article.titre} - Camer.be`
        }
      ],
      "contentLocation":{
        "@type": "Place",
        "name": this.article.countries.pays
      },
      "articleBody":this.article.info,
      "wordCount": {
        "@type": "QuantitativeValue",
        "value": this.wordCount,
        "unitText": "Words"

      },
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "ReadAction" },
          "userInteractionCount": this.article.hit
        }
      ],
      "sameAs": [
        "https://www.facebook.com/camergroup",
        "https://x.com/camerbe"
      ],
    }
    this.jsonLdService.setJsonLd(jsonLd);
    // setTimeout(() => {
    //   this.setupAdAfterFirstParagraph();
    // }, 300);
    //this.setupAdAfterFirstParagraph();
  }
  setupAdAfterFirstParagraph() {
    const container = this.articleContentContainer?.nativeElement;
    if (!container) return;
    this.mutationObserver = new MutationObserver((mutations) => {
      const hasParagraphs = container.querySelectorAll('p').length > 0;
      if (hasParagraphs) {
        this.insertAdAfterFirstParagraph();
        this.mutationObserver.disconnect();
      }
    });
    this.mutationObserver.observe(container, { childList: true, subtree: true });
    if (container.querySelectorAll('p').length > 0){
       this.insertAdAfterFirstParagraph();
       this.mutationObserver.disconnect();
    }
  }
  insertAdAfterFirstParagraph() {
    const container = this.articleContentContainer?.nativeElement;
     if (!container) return;
     const paragraphs = container.querySelectorAll('p');
     if (paragraphs.length === 0) return;
     const placeholder = document.createElement('div');
     paragraphs[0].insertAdjacentElement('afterend', placeholder);
     const adRef =  this.viewContainerRef.createComponent(AdsenseComponent,{ injector: this.injector });
      adRef.instance.adClient = 'ca-pub-8638642715460968';
      adRef.instance.adSlot = '6927429462';
      adRef.instance.adFormat = 'auto';
      adRef.instance.fullWidthResponsive = true;

      this.viewContainerRef.insert(adRef.hostView);
      placeholder.replaceWith(adRef.location.nativeElement);

  }
  get wordCount(): number {
    if (!this.article?.info) return 0;

    // Create a temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.article.info;

    // Extract all visible text content
    let text = tempDiv.textContent || tempDiv.innerText || '';

    // Decode common HTML entities
    text = text.replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');

    // Normalize spacing and trim
    text = text.replace(/\s+/g, ' ').trim();

    // Count words
    return text ? text.split(' ').length : 0;
  }

  getImageUrl(article: ArticleDetail): string{
  return article.image_url.startsWith('http')
    ? article.image_url
    : `https://www.camer.be${article.image_url}`;
  }
}
