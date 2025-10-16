import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SlugifyService } from '../../services/slugify.service';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { Meta, Title } from '@angular/platform-browser';

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
  templateUrl: './sousrubrique-article.component.html',
  styleUrl: './sousrubrique-article.component.css'
})
export class SousrubriqueArticleComponent implements OnInit {

  @Input() rubriqueArticles=signal<ArticleDetail[]>([]);
  @Input() label=signal('');
  dateModif=signal('');
  keyWord=signal('');
  isBrowser=signal(false);

  slugifyService=inject(SlugifyService);
  keywordAndHashtagService=inject(KeywordAndHashtagService);
  platformId = inject(PLATFORM_ID);
  metaService=inject(Meta);
  titleService=inject(Title);
  router=inject(Router);

   ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    this.label.set(this.rubriqueArticles()[0].sousrubrique.sousrubrique);
    this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;

    this.titleService.setTitle(`Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}`);
      this.metaService.updateTag({ name: 'description', content: `Camer.be est le site de la diaspora du cameroun. camer.be is the leading portal of cameroon in belgium. L&#039;info claire et nette. ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}` });
      this.metaService.updateTag({ name: 'keywords', content: `cameroun,cameroon,cameroun,cameroon,camer,information,claire,nette,cameroun,cameroon,camer,est,site,diaspora,the,leading,portal,belgium,${this.rubriqueArticles()[0].sousrubrique.sousrubrique}`});
      this.metaService.updateTag({ name: 'og:title', content: `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}` });
      this.metaService.updateTag({ name: 'og:description', content: `Camer.be est le site de la diaspora du cameroun. camer.be is the leading portal of cameroon in belgium. L&#039;info claire et nette. ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}` });
      this.metaService.updateTag({ name: 'og:image', content: `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });
      this.metaService.updateTag({ name: 'og:image:alt', content: `Logo Camer.be` });
      this.metaService.updateTag({ name: 'og:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });
      this.metaService.updateTag({ name: 'og:type', content: 'article' });
      this.metaService.updateTag({ name: 'og:locale', content: 'fr_FR' });
      this.metaService.updateTag({ name: 'og:locale:alternate', content: 'en-us' });
      this.metaService.updateTag({ name: 'og:site_name', content: 'Camer.be' });
      this.metaService.updateTag({ name: 'twitter:title', content: `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU`})
      this.metaService.updateTag({ name: 'twitter:description', content: `Camer.be est le site de la diaspora du cameroun. camer.be is the leading portal of cameroon in belgium. L&#039;info claire et nette. ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}` });
      this.metaService.updateTag({ name: 'twitter:image', content:  `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });
      this.metaService.updateTag({ name: 'twitter:image:alt', content:  `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU ${this.rubriqueArticles()[0].sousrubrique.sousrubrique}` });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:site', content: '@camer.be' });
      this.metaService.updateTag({ name: 'twitter:creator', content: '@camerbe' });
      this.metaService.updateTag({ name: 'twitter:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });

  }
  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }
}
