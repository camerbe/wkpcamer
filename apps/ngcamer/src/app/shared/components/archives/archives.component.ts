
import { Component, OnInit, AfterViewInit, inject, signal, PLATFORM_ID, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
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
  styleUrls: ['./archives.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ArchivesComponent  {

  private readonly router=inject(Router);
  private readonly slugifyService=inject(SlugifyService);



  readonly articleWeekList  = signal<ArticleDetail[]>([]);
  readonly articleMonthList = signal<ArticleDetail[]>([]);
  readonly articleYearList = signal<ArticleDetail[]>([]);

  @Input ({ required: true })
  set articleWeekListInput(value: ArticleDetail[]) {
    this.articleWeekList.set(value);
  }
  @Input ({ required: true })
  set articleMonthListInput(value: ArticleDetail[]) {
    this.articleMonthList.set(value);
  }
  @Input ({ required: true })
  set articleYearListInput(value: ArticleDetail[]) {
    this.articleYearList.set(value);
  }

  //Computed signals pour vérifier si les listes ont du contenu
  readonly hasWeekArticles = computed(() => this.articleWeekList().length > 0);
  readonly hasMonthArticles = computed(() => this.articleMonthList().length > 0);
  readonly hasYearArticles = computed(() => this.articleYearList().length > 0);

  isBrowser = signal(false);
  readonly platformId = inject(PLATFORM_ID);

  private imageUrlCache = new Map<string, string>();
  private readonly slugCache = new Map<string, string>();

  getImageUrl(article: ArticleDetail): string {
   const cacheKey = article.slug;

    if (this.imageUrlCache.has(cacheKey)) {
      return this.imageUrlCache.get(cacheKey)!;
    }
    //console.log('Processing image URL for article:', this.imageUrlCache);
    const url = article.image_url.startsWith('http')
      ? article.image_url
      : `https://www.camer.be${article.image_url}`;



    this.imageUrlCache.set(cacheKey, url);
    return url;
  }
  gotoArticle(rubrique: string,sousrubrique: string,slug: string) {
    const cacheKey = `${rubrique}|${sousrubrique}`;

    let slugifiedPath = this.slugCache.get(cacheKey);
    if (!slugifiedPath) {
      slugifiedPath = `/${this.slugifyService.slugify(rubrique)}/${this.slugifyService.slugify(sousrubrique)}`;
      this.slugCache.set(cacheKey, slugifiedPath);
    }

    this.router.navigateByUrl(`${slugifiedPath}/${slug}`);
  }
   trackByArticle(index: number, article: ArticleDetail): string | number {
    return article.idarticle ?? article.slug ?? index;
  }

  handleKeypress(event: KeyboardEvent, rubrique: string, sousrubrique: string, slug: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.gotoArticle(rubrique, sousrubrique, slug);
    }
  }
  getImageAltText(article: ArticleDetail): string {
    return `${article.countries.pays} :: ${article.titre}`;
  }
}
