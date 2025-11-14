import localeFr from '@angular/common/locales/fr';
import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { afterRenderEffect, AfterViewInit, ChangeDetectorRef, Component, inject, Input, LOCALE_ID, OnChanges, OnInit, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SlugifyService } from '../../services/slugify.service';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { Meta, Title } from '@angular/platform-browser';
import { JsonLdService } from '../../services/json-ld.service';

registerLocaleData(localeFr);
@Component({
  selector: 'app-sousrubrique-article',
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
  styleUrl: './sousrubrique-article.component.css'
})
export class SousrubriqueArticleComponent implements OnInit,AfterViewInit,OnChanges {


  @Input() rubriqueArticles=signal<ArticleDetail[]>([]);
  @Input() label=signal('');
  dateModif=signal('');
  keyWord=signal('');
  isBrowser=signal(false);
  firstArticle !:ArticleDetail;
  jsonLdArticles: ArticleDetail[] = [];
  thematicKeywords: { [key: string]: string[] } = {
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

    // VIDÉOS (Note: le slug contient la barre oblique, à gérer lors de l'appel)
    'video/camer': ['reportages Cameroun', 'vidéos actualités', 'téléréalité camerounaise'],

    // Liste de secours (DÉFAUT)
    'defaut': ['actualités cameroun', 'info cameroun', 'diaspora camerounaise', 'Camer.be']
  };

  baseKeywords: string[] = [
    'Camer.be',
    'info claire et nette',
    'diaspora camerounaise',
    'actualité Afrique',
    'Cameroun',
    'Cameroon'
  ];
  logoUrl = '';


  slugifyService=inject(SlugifyService);
  keywordAndHashtagService=inject(KeywordAndHashtagService);
  platformId = inject(PLATFORM_ID);
  metaService=inject(Meta);
  titleService=inject(Title);
  router=inject(Router);
  jsonLdService=inject(JsonLdService);
  cdr=inject(ChangeDetectorRef);
  /**
   *
   */
  constructor() {
    afterRenderEffect(() =>{
      this.firstArticle=this.rubriqueArticles()[0];

      this.jsonLdArticles=this.rubriqueArticles().slice(0,10);

      this.loadJsonLd();
    })

  }

   ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    if (typeof window !== 'undefined') {
      this.logoUrl = `${window.location.protocol}//${window.location.host}/assets/images/logo.png`;
    }
    this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
    const tmpTitre='Actualités Cameroun, Info & Analyse – Politique, Sport, Diaspora | Camer.be';
     let dynamicDescription = 'Camer.be: Info claire et nette sur le Cameroun et la Diaspora. ';
    if(this.rubriqueArticles() && this.rubriqueArticles()?.length > 0){
      dynamicDescription += `${this.firstArticle.rubrique.rubrique} : ${this.firstArticle.titre}.`;

       const finalDescription = dynamicDescription.substring(0, 155).trim();

       const subCategoryPath = this.router.url.substring(this.router.url.lastIndexOf("/") + 1) ;
      const thematicKeywords = this.getThematicKeywords(subCategoryPath);

       this.titleService.setTitle(`${tmpTitre}`);
      this.metaService.updateTag({ name: 'description', content: `${finalDescription}` });
      this.metaService.updateTag({ name: 'keywords', content: `${thematicKeywords}`});
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

  }
  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }
  loadJsonLd(){
    const tmpTitre='Actualités Cameroun, Info & Analyse – Politique, Sport, Diaspora | Camer.be';
        //let dynamicDescription = 'Camer.be: Info claire et nette sur le Cameroun et la Diaspora. ';

        const listElements = this.jsonLdArticles.map((article, index) => {
          const date =new Date(Date.now());
          const today=date.toISOString().slice(0, 19) + '+00:00'
          const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';

          const year = new Date(article.dateparution).getFullYear();
          const articleUrl = `${window.location.protocol}//${window.location.host}/${article.rubrique.rubrique.toLowerCase()}/${article.sousrubrique.sousrubrique.toLowerCase()}/${article.slug}`;
          return{
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
      this.cdr.detectChanges()
  }
  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    const subCategoryPath = this.router.url.substring(this.router.url.lastIndexOf("/") + 1) ;
    const thematicKeywords = this.getThematicKeywords(subCategoryPath);

    // console.log(thematicKeywords);
    // console.log(this.router.url);
    // console.log(this.jsonLdArticles);
    // console.log(this.rubriqueArticles);
    // if(this.jsonLdArticles && this.jsonLdArticles.length>0){

    // }
  }

  getThematicKeywords(subCategoryPath: string): string {
    if (!subCategoryPath) {
      return this.thematicKeywords['defaut'].join(', ') + ', ' + this.baseKeywords.join(', ');
    }

    // 1. Nettoyage du chemin pour obtenir la clé (gère les slugs multiples comme 'video/camer')
    // Supprime la première barre oblique s'il y en a une, puis utilise le reste comme clé.
    const cleanPath = subCategoryPath.startsWith('/') ? subCategoryPath.substring(1) : subCategoryPath;

    // 2. Recherche par la clé nettoyée
    const keywords = this.thematicKeywords[cleanPath] || this.thematicKeywords['defaut'];

    // 3. Concaténation des mots-clés thématiques et des mots-clés de base
    const finalKeywords = [...keywords, ...this.baseKeywords];

    // 4. Retourne la liste séparée par des virgules
    return finalKeywords.join(', ');
  }
  getKeywordsArray(item: any): string {
    return item.keyword
      ? item.keyword.split(',').map((k: string) => k.trim()).join(', ')
      : '';
  }
  ngOnChanges(): void {
    if (this.rubriqueArticles()?.length > 0) {
    this.firstArticle = this.rubriqueArticles()[0];
    this.jsonLdArticles = this.rubriqueArticles().slice(0, 10);
    this.loadJsonLd();
  }
  }
}
