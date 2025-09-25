import { ResolveFn } from '@angular/router';
import { ArticleService } from '@wkpcamer/services/articles';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const accueilResolver: ResolveFn< ArticleDetail[]|null > = (route, state) => {
  //const articleService = inject(ArticleService);
   return  inject(ArticleService).getArticle().pipe(map((data)=>{
    const tmpData = data as unknown as Article;
      const articles = tmpData['data'] as unknown as  ArticleDetail[];
      return articles ?? null;
   }));
};
