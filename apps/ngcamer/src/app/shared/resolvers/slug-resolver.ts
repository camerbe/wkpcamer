import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { map } from 'rxjs';

export const slugResolver: ResolveFn< ArticleDetail | null> = (route, state) => {
  const slug= route.params["slug"];
  if (!slug) return  null;
  return inject(ArticleService).getArticleBySlug(slug).pipe(map((data)=>{
    const tmpData = data as unknown as Article;
    const article = tmpData['data'] as unknown as  ArticleDetail;
    return article ?? null;
  }));
};
