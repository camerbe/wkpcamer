import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Article } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';

export const slugResolver: ResolveFn< Article | null> = (route, state) => {
  const slug= route.params["slug"];
  if (!slug) return  null;
  return inject(ArticleService).getArticleBySlug(slug);
};
