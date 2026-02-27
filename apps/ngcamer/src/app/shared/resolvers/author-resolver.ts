import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { map } from 'rxjs';

export const authorResolver: ResolveFn<ArticleDetail[]|null> = (route) => {
  const auteur= route.params["auteur"];
   if (!auteur) return  null;
  return  inject(ArticleService).getArticleByAuthor(auteur).pipe(map((data)=>{
    const tmpData = data as unknown as Article;
      const articles = tmpData['data'] as unknown as  ArticleDetail[];
      return articles ?? null;
   }));
};
