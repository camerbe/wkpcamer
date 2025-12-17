
import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
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
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit,AfterViewInit,OnDestroy{



  @Input() indexArticles: ArticleDetail[] = [];
  listCamer: ArticleDetail[] = [];
  listOther: ArticleDetail[] = [];
  jsonLdArticles: ArticleDetail[] = [];
  jsonLdObjects: unknown[] = [];
  combinedList: { item1: ArticleDetail; item2: ArticleDetail; }[] = [];
  isBrowser = signal(false);
  imageSize = 'medium';
  dateModif=signal('');
  breakpointSubscription!: Subscription;
  logoUrl = '';

  slugifyService=inject(SlugifyService);
  metaService=inject(Meta);
  titleService=inject(Title);
  router=inject(Router);
  platformId = inject(PLATFORM_ID);
  keywordAndHashtagService=inject(KeywordAndHashtagService);
  jsonLdService=inject(JsonLdService);
  breakpointObserver=inject(BreakpointObserver);
  //breakpointSubscription=inject(Subscription);

  /**
   *
   */
  constructor() {
    this.breakpointSubscription =this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe({
      next: (result) => {
        if (result.breakpoints[Breakpoints.Handset]) {
          this.imageSize = 'small';
        }
        else if (result.breakpoints[Breakpoints.Tablet]) {
          this.imageSize = 'medium';
        }
        else if (result.breakpoints[Breakpoints.Web]) {
          this.imageSize = 'large';
        }
      }
    });

  }


  getImageSize(): string {
    switch (this.imageSize) {
      case 'small': return '(max-width: 600px) 100vw';
      case 'medium': return '(max-width: 1024px) 50vw';
      default: return '33vw';
    }
  }
  // Retourne une chaîne srcset valide pour NgOptimizedImage
getSrcSet(imageUrl: string): string {
  if (!imageUrl) return '';
  const baseUrl = imageUrl.startsWith('http') ? imageUrl : `https://www.camer.be${imageUrl}`;
  return [
    `${baseUrl}?w=480 480w`,
    `${baseUrl}?w=768 768w`,
    `${baseUrl}?w=1200 1200w`
  ].join(', ');
}

// Optionnel : pour [sizes] responsive
getSizes(): string {
  return '(max-width: 768px) 100vw, 50vw';
}



  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    if (typeof window !== 'undefined') {
      this.logoUrl = `${window.location.protocol}//${window.location.host}/assets/images/camer-logo.png`;
    }
     this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
     const tmpTitre='Actualités Cameroun, Info & Analyse – Politique, Sport, Diaspora | Camer.be';
     let dynamicDescription = 'Camer.be: Info claire et nette sur le Cameroun et la Diaspora. ';
    if(this.indexArticles){
      dynamicDescription += `À la une : ${this.indexArticles[0].titre}.`;

      const finalDescription = dynamicDescription.substring(0, 155).trim();
      this.listCamer=this.indexArticles.filter(c=>c.fkpays==='CM');
      this.listOther=this.indexArticles.filter(c=>c.fkpays!=='CM');
      this.combinedList = this.listCamer.map((camerItem, index) => {
        return {
          item1: camerItem,
          item2: this.listOther[index]
        };
      });
      this.jsonLdArticles=this.indexArticles.slice(0,10);
      this.titleService.setTitle(`${tmpTitre}`);
      this.metaService.updateTag({ name: 'description', content: `${finalDescription}` });
      this.metaService.updateTag({ name: 'keywords', content: `actualités cameroun en direct, info cameroun dernière minute, politique cameroun, sport camerounais, lions indomptables, diaspora camerounaise, économie cameroun, Douala, Yaoundé, revue de presse camerounaise, investir au cameroun`});
      this.metaService.updateTag({ name: 'og:title', content: `${tmpTitre}` });
      this.metaService.updateTag({ name: 'og:description', content: `${finalDescription}` });
      this.metaService.updateTag({ name: 'og:image', content: `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });
      this.metaService.updateTag({ name: 'og:image:alt', content: `${tmpTitre}` });
      this.metaService.updateTag({ name: 'og:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });
      this.metaService.updateTag({ name: 'og:type', content: 'article' });
      this.metaService.updateTag({ name: 'og:locale', content: 'fr_FR' });
      this.metaService.updateTag({ name: 'og:locale:alternate', content: 'en-us' });
      this.metaService.updateTag({ name: 'og:site_name', content: 'Camer.be' });
      this.metaService.updateTag({ name: 'twitter:title', content: `${tmpTitre}`})
      this.metaService.updateTag({ name: 'twitter:description', content: `${finalDescription}` });
      this.metaService.updateTag({ name: 'twitter:image', content:  `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });
      this.metaService.updateTag({ name: 'twitter:image:alt', content:  `${tmpTitre}` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:site', content: '@camer.be' });
      this.metaService.updateTag({ name: 'twitter:creator', content: '@camerbe' });
      this.metaService.updateTag({ name: 'twitter:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });



    }
    else{
      console.log("Null");
    }


  }


  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    if(this.indexArticles && this.indexArticles.length>0){
      const listElements = this.jsonLdArticles.map((article, index) => {
        //let keywords='';
        const date =new Date(Date.now());
        const today=date.toISOString().slice(0, 19) + '+00:00'
        const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';
        const year = new Date(article.dateparution).getFullYear();
        const articleUrl = `${window.location.protocol}//${window.location.host}/${article.rubrique.rubrique.toLowerCase()}/${article.sousrubrique.sousrubrique.toLowerCase()}/${article.slug}`;
        //keywords=article.keyword
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
              "logo": { "@type": "ImageObject", "url": `${window.location.protocol}//${window.location.host}/assets/images/camer-logo.png`, "width": 190, "height": 52 }
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
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": {
                  "@type": "http://schema.org/ReadAction"
                },
                "userInteractionCount": article.hit
              }
            ],
            "sameAs": ["https://www.facebook.com/camergroup", "https://x.com/camerbe"]
          },

        };
      });
      const jsonLdGlobal = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": this.titleService.getTitle(),
        "description": this.metaService.getTag('name=description')?.content,
        "url": `${window.location.protocol}//${window.location.host}${this.router.url}`,
        "mainContentOfPage": {
          "@type": "ItemList",
          "itemListElement": listElements
        }
      };

      this.jsonLdService.setJsonLd([jsonLdGlobal]);
    }
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }
  getKeywordsArray(item: unknown): string {
    const data = item as { keyword?: string };
    return data.keyword
      ? data.keyword.split(',').map((k: string) => k.trim()).join(', ')
      : '';
  }
}
