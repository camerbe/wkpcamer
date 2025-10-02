import { Article, ArticleDetail } from '@wkpcamer/models';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DatePipe, NgOptimizedImage, registerLocaleData } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollTopModule } from 'primeng/scrolltop';
import { DividerModule } from 'primeng/divider';
import localeFr from '@angular/common/locales/fr';
import { ArticleMetaService } from '../../shared/services/article-meta.service';
import { CanonicalService } from '../../shared/services/canonical.service';
import { SlugifyService } from '../../shared/services/slugify.service';
import { RelatedArticlesComponent } from "../../shared/components/related-articles/related-articles.component";

registerLocaleData(localeFr);

@Component({
  selector: 'app-article',
  imports: [
    CardModule,
    NgOptimizedImage,
    DatePipe,
    ScrollTopModule,
    DividerModule,
    RelatedArticlesComponent
],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit{
  article!:ArticleDetail;
  slug!:string;
  relatedArticles=signal<ArticleDetail[]>([]);

  articleService=inject(ArticleService);
  activatedRoute=inject(ActivatedRoute);
  sanitizer=inject(DomSanitizer);
  articleMetaService=inject(ArticleMetaService);
  canonicalService=inject(CanonicalService)
  router=inject(Router);
  slugifyService=inject(SlugifyService);
  ngOnInit(): void {
     this.slug=this.activatedRoute.snapshot.params["slug"];
     this.activatedRoute.data.subscribe({
      next:(data)=>{
        const tmpData=data["articleSlug"]
        this.article=tmpData["data"];
        this.articleMetaService.updateArticleMeta(this.article);
        this.canonicalService.setCanonicalURL(`${window.location.protocol}//${window.location.host}${this.router.url}`)
        //console.log(this.article)
      }
     });

     this.articleService.getSameRubrique(this.article.fksousrubrique).subscribe({
        next:(data)=>{
          const tmpData=data as unknown as Article;
          this.relatedArticles.set(tmpData["data"] as unknown as ArticleDetail[]);
        }
     });
  }

}
