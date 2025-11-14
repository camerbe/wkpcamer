import { ArticleService } from '@wkpcamer/services/articles';
import { Component, OnInit, AfterViewInit, inject, signal, PLATFORM_ID, Input } from '@angular/core';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { SlugifyService } from '../../services/slugify.service';

@Component({
  selector: 'app-archives',
  imports: [
    NgOptimizedImage,
    CardModule,
    CommonModule
  ],
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css']
})
export class ArchivesComponent implements OnInit, AfterViewInit {


  @Input () articleWeekList: ArticleDetail[] = [];
  @Input () articleMonthkList: ArticleDetail[] = [];
  @Input () articleYearList: ArticleDetail[] = [];

  isBrowser = signal(false);


  platformId = inject(PLATFORM_ID);
  router=inject(Router);
  slugifyService=inject(SlugifyService);
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
  }

  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;


  }
  getImageUrl(article: ArticleDetail): string {

    return article.image_url.startsWith('http')
    ? article.image_url
    : `https://www.camer.be${article.image_url}`;
  }
  gotoArticle(rubrique: string,sousrubrique: string,slug: string) {
  this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
      this.router.navigate(['/'+this.slugifyService.slugify(rubrique)+'/'+this.slugifyService.slugify(sousrubrique),slug]);
    });
  }
}
