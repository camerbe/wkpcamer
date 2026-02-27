import localeFr from '@angular/common/locales/fr';
import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SlugifyService } from '../../services/slugify.service';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLdService } from '../../services/json-ld.service';
import { CanonicalService } from '../../services/canonical.service';

registerLocaleData(localeFr);

// ✅ CONSTANTES EXTERNES (évite recréation à chaque instance)
const THEMATIC_KEYWORDS: Readonly<Record<string, readonly string[]>> = {
  // ACTUALITÉ & SOCIÉTÉ
  'diaspora': ['diaspora camerounaise belgique', 'événements camerounais europe', 'vie des camerounais à l\'étranger', 'actualités diaspora'],
  'economie': ['investissement cameroun', 'analyse économique afrique', 'marché Douala', 'opportunités business cameroun', 'prix des produits Cameroun'],
  'religion': ['actualités religieuses Cameroun', 'églises Cameroun', 'communauté musulmane camerounaise', 'foi et société'],
  'societe': ['faits divers cameroun', 'mœurs et coutumes camerounaises', 'actualité sociale cameroun', 'problèmes sociaux Yaoundé'],
  'politique': ['actualité politique Cameroun', 'analyse gouvernement Biya', 'scrutin présidentiel', 'opposition camerounaise', 'climat politique Afrique'],

  // INTERNATIONAL & GÉOPOLITIQUE
  'francaiscamer': ['relation France Cameroun', 'coopération franco-camerounaise', 'liens post-coloniaux', 'influence française'],
  'francafrique': ['analyse Françafrique', 'critique néocolonialisme', 'relations France Afrique', 'souveraineté africaine'],
  'geopolitique': ['analyse géopolitique Afrique Centrale', 'relations internationales Cameroun', 'pouvoir mondial', 'diplomatie camerounaise'],

  // DIVERTISSEMENT
  'insolite': ['histoires insolites Cameroun', 'faits étranges Afrique', 'curiosités camerounaises'],
  'le-saviez-vous': ['anecdotes Cameroun', 'culture générale Afrique', 'faits historiques camerounais'],
  'people': ['actualité célébrités camerounaises', 'people Afrique', 'stars et potins Cameroun'],
  'sans-tabou': ['débats société Cameroun', 'liberté d\'expression', 'opinion et controverse'],

  // SANTÉ & BIEN-ÊTRE
  'allo-docteur': ['conseils santé Cameroun', 'médecine africaine', 'prévention maladies tropicales'],
  'sante': ['actualité santé Cameroun', 'système de santé publique', 'bien-être Afrique'],

  // CULTURE
  'art': ['scène artistique Cameroun', 'artistes camerounais', 'galeries d\'art Douala'],
  'cinema': ['films camerounais', 'critiques cinéma Afrique', 'actualité Nollywood Cameroun'],
  'livres': ['auteurs camerounais', 'littérature africaine', 'chroniques de livres'],
  'musique': ['musique camerounaise', 'artistes Mbalax Bikutsi', 'nouveautés musicales Afrique'],

  // EXPRESSION LIBRE
  'le-debat': ['tribune libre Cameroun', 'sujets de débat société', 'opinion publique'],
  'point-du-droit': ['actualité juridique Cameroun', 'analyse loi et justice', 'droits humains'],
  'point-de-vue': ['chroniques politiques', 'analyse experts Cameroun', 'réflexions d\'opinion'],

  // VIDÉOS
  'video/camer': ['reportages Cameroun', 'vidéos actualités', 'téléréalité camerounaise'],

  // DÉFAUT
  'defaut': ['actualités cameroun', 'info cameroun', 'diaspora camerounaise', 'Camer.be']
} as const;

const BASE_KEYWORDS: readonly string[] = [
  'Camer.be',
  'info claire et nette',
  'diaspora camerounaise',
  'actualité Afrique',
  'Cameroun',
  'Cameroon'
] as const;

// ✅ INTERFACE POUR ARTICLES ENRICHIS
interface ArticleWithMetadata extends ArticleDetail {
  position: number;
  routerLink: string;
  keywordsArray: string;
  wordCount: number;
  slugifiedRubrique: string;
  slugifiedSousRubrique: string;
  flagUrl: string;
}
@Component({
  selector: 'app-sousrubrique-article',
  standalone: true,
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
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  templateUrl: './sousrubrique-article.component.html',
  styleUrl: './sousrubrique-article.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SousrubriqueArticleComponent  {




  // ✅ INJECTION
  private readonly slugifyService=inject(SlugifyService);
  //private readonly keywordAndHashtagService=inject(KeywordAndHashtagService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly metaService=inject(Meta);
  private readonly titleService=inject(Title);
  private readonly router=inject(Router);
  private readonly jsonLdService=inject(JsonLdService);
  //private readonly cdr=inject(ChangeDetectorRef);
  private readonly canonicalService=inject(CanonicalService);

  // ✅ PROPRIÉTÉS DÉRIVÉES (calculées une seule fois)
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly baseUrl = this.isBrowser
    ? `${window.location.protocol}//${window.location.host}`
    : '';

  // ✅ INPUTS AVEC SIGNALS (nouvelle API Angular 20)
  readonly rubriqueArticles = input.required<ArticleDetail[]>();
  readonly label = input<string>('');

  // ✅ COMPUTED SIGNALS (mémoïsation automatique)
  readonly firstArticle = computed(() => {
    const articles = this.rubriqueArticles();
    return articles.length > 0 ? articles[0] : null;
  });

  readonly jsonLdArticles = computed(() =>
    this.rubriqueArticles().slice(0, 10)
  );

  readonly dateModif = computed(() =>
    new Date().toISOString().slice(0, 19) + '+00:00'
  );

  readonly logoUrl = computed(() =>
    `${this.baseUrl}/assets/images/logo.png`
  );

  // ✅ ARTICLES AVEC MÉTADONNÉES PRÉ-CALCULÉES (évite calculs dans template)
  readonly articlesWithMetadata = computed<ArticleWithMetadata[]>(() =>
    this.rubriqueArticles().map((article, index) => ({
      ...article,
      position: index + 1,
      routerLink: this.buildRouterLink(article),
      keywordsArray: this.formatKeywords(article.keyword),
      wordCount: this.calculateWordCount(article.info),
      slugifiedRubrique: this.slugifyService.slugify(article.rubrique.rubrique),
      slugifiedSousRubrique: this.slugifyService.slugify(article.sousrubrique.sousrubrique),
      flagUrl: this.getFlag(article)
    }))
  );

  private getFlag(article:ArticleDetail): string {
    const countryCode = article.fkpays.toLowerCase();
    switch (countryCode) {
      case 'f': return `https://flagcdn.com/16x12/au.webp`;
      case 'zz': return `https://flagcdn.com/16x12/un.webp`;
      default: return `https://flagcdn.com/16x12/${countryCode}.webp`;
    }
    
  }
  /**
   *
   */
  constructor() {
    // ✅ EFFECT UNIQUE pour gérer SEO et JSON-LD (remplace ngOnInit/ngOnChanges/afterRenderEffect)
    effect(() => {
      if (!this.isBrowser) return;

      const articles = this.rubriqueArticles();
      if (articles.length === 0) return;

      // Mettre à jour SEO et JSON-LD en une seule fois
      this.updateSEO();
      this.loadJsonLd();
    });

  }


    private updateSEO(): void {
    const first = this.firstArticle();
    if (!first) return;

    const currentUrl = `${this.baseUrl}${this.router.url}`;
    const titre = `Actualités Cameroun, Info & Analyse – Politique, Sport, ${first.sousrubrique.sousrubrique} | Camer.be`;
    const dynamicDescription = `Camer.be: Info claire et nette sur le Cameroun et la Diaspora. ${first.rubrique.rubrique} : ${first.titre}.`;
    const finalDescription = dynamicDescription.substring(0, 155).trim();

    const subCategoryPath = this.router.url.substring(this.router.url.lastIndexOf("/") + 1);
    const keywords = this.getThematicKeywords(subCategoryPath);

    // URLs canoniques
    this.canonicalService.setCanonicalURL(currentUrl);
    this.canonicalService.setAmpCanonicalURL(`${this.baseUrl}/amp${this.router.url}`);

    // Titre
    this.titleService.setTitle(titre);

    // ✅ BATCH META TAGS (regrouper pour réduire DOM thrashing)
    const metaTags = [
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: keywords },
      { name: 'og:title', content: titre },
      { name: 'og:description', content: finalDescription },
      { name: 'og:image', content: this.logoUrl() },
      { name: 'og:image:alt', content: titre },
      { name: 'og:url', content: currentUrl },
      { name: 'og:type', content: 'article' },
      { name: 'og:locale', content: 'fr_FR' },
      { name: 'og:locale:alternate', content: 'en-us' },
      { name: 'og:site_name', content: 'Camer.be' },
      { name: 'twitter:title', content: titre },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: this.logoUrl() },
      { name: 'twitter:image:alt', content: titre },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@camer.be' },
      { name: 'twitter:creator', content: '@camerbe' },
      { name: 'twitter:url', content: currentUrl }
    ];

    metaTags.forEach(tag => this.metaService.updateTag(tag));
  }
  private calculateWordCount(info: string): number {
    const text = info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }
  private buildRouterLink(article: ArticleDetail): string {
    return `/${this.slugifyService.slugify(article.rubrique.rubrique)}/${this.slugifyService.slugify(article.sousrubrique.sousrubrique)}/${article.slug}`;
  }
  private formatKeywords(keyword?: string): string {
    return keyword
      ? keyword.split(',').map(k => k.trim()).join(', ')
      : '';
  }
  private loadJsonLd(){
   const articles = this.jsonLdArticles();
    if (articles.length === 0) return;

    const listElements = articles.map((article, index) => {
      const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';
      const year = new Date(article.dateparution).getFullYear();
      const articleUrl = `${this.baseUrl}/${article.rubrique.rubrique.toLowerCase()}/${article.sousrubrique.sousrubrique.toLowerCase()}/${article.slug}`;

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
          "dateModified": this.dateModif(),
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
              "url": `${this.baseUrl}/assets/images/camer-logo.png`,
              "width": 190,
              "height": 52
            }
          },
          "image": {
            "@type": "ImageObject",
            "url": article.image_url,
            "width": article.image_width,
            "height": article.image_height,
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
          "sameAs": ["https://www.facebook.com/camergroup", "https://x.com/camerbe"]
        }
      };
    });

    const jsonLdGlobal = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": this.titleService.getTitle(),
      "description": this.metaService.getTag('name=description')?.content,
      "url": `${this.baseUrl}${this.router.url}`,
      "mainContentOfPage": {
        "@type": "ItemList",
        "itemListElement": listElements
      }
    };

    this.jsonLdService.setJsonLd([jsonLdGlobal]);
  }

   private getThematicKeywords(subCategoryPath: string): string {
    if (!subCategoryPath) {
      return [...THEMATIC_KEYWORDS['defaut'], ...BASE_KEYWORDS].join(', ');
    }

    const cleanPath = subCategoryPath.startsWith('/')
      ? subCategoryPath.substring(1)
      : subCategoryPath;

    const keywords = THEMATIC_KEYWORDS[cleanPath] || THEMATIC_KEYWORDS['defaut'];
    return [...keywords, ...BASE_KEYWORDS].join(', ');
  }
  getKeywordsArray(item: unknown): string {
    const data = item as { keyword?: string };
    return data.keyword
      ? data.keyword.split(',').map((k: string) => k.trim()).join(', ')
      : '';
  }
  
}
