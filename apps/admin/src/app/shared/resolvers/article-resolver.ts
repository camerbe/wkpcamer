import { ResolveFn } from '@angular/router';
import { Article } from '@wkpcamer/models';
import { inject } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
export const articleResolver: ResolveFn<Article | null> = (route) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(ArticleService).show(id);
};
