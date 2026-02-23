import { Injectable, signal, inject } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { forkJoin, tap, of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private articleService = inject(ArticleService);
  weekList = signal<ArticleDetail[]>([]);
  monthList = signal<ArticleDetail[]>([]);
  yearList = signal<ArticleDetail[]>([]);

  private isLoaded = false;

  loadFooterData(): Observable<any>{
    if (this.isLoaded) return of(null); // On ne fait rien si déjà chargé
    return forkJoin({
      weekData: this.articleService.getArticleByPeriod('week'),
      monthData: this.articleService.getArticleByPeriod('month'),
      yearData: this.articleService.getArticleByPeriod('year')
    }).pipe(tap(result=>{
      const tmpWeek=result.weekData as unknown as Article;
      const tmpMonth=result.monthData as unknown as Article;
      const tmpYear=result.yearData as unknown as Article;

      this.weekList.set(( tmpWeek["data"] as unknown as ArticleDetail[]));
      this.monthList.set((tmpMonth["data"] as unknown as ArticleDetail[]));
      this.yearList.set((tmpYear["data"]  as unknown as ArticleDetail[]));
      this.isLoaded = true;
    }));
  }
}

