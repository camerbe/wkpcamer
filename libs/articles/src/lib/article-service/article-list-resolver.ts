import { Article, ArticleDetail } from '@wkpcamer/models';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LocalstorageService } from '@wkpcamer/localstorage';
import { ArticleService } from '../..';
import { map } from 'rxjs';

export const articleListResolver: ResolveFn<ArticleDetail[]|null> = () => {
  const localstorageService=inject(LocalstorageService);
  const token=localstorageService.getToken();
  if(token){
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    const id =+decodedToken.userId;
    return inject(ArticleService).getArticleByUser(id).pipe(
      map((data) => {
        const tmpData = data as unknown as Article;
        const articles = tmpData["data"] as unknown as ArticleDetail[];
        return articles
      })
    );
  }
  return null;
};
