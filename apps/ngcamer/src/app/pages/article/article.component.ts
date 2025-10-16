import { KeywordAndHashtagService } from '@wkpcamer/users';
import { Article, ArticleDetail, SportDetail } from '@wkpcamer/models';
import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
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
    AdMoneytizerComponent
],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit,AfterViewInit{


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

  sportBehaviorService=inject(SportBehaviorService);


  ngOnInit(): void {
    this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    this.slug=this.activatedRoute.snapshot.params["slug"];
    this.article=this.activatedRoute.snapshot.data['articleSlug'] ;
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
    this.loadTaboolaWidget(this.router.url);
  }
  get wordCount(): number {
    // Remove HTML tags and count words
    const text = this.article.info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }
}
