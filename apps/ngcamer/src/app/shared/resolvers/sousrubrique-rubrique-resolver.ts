import { ResolveFn } from '@angular/router';
import { Article, ArticleDetail } from '@wkpcamer/models';

import { inject } from '@angular/core';
import { UrlMapperService } from '../services/url-mapper.service';
import { ArticleService } from '@wkpcamer/services/articles';
import { map } from 'rxjs';

export const sousrubriqueRubriqueResolver: ResolveFn<ArticleDetail[]|null> = (route) => {

  const urlMapperService=inject(UrlMapperService);
  const rubrique= route.params["rubrique"];
  const sousrubrique= route.params["sousrubrique"];
  const url=rubrique+'/'+sousrubrique;
  const toSplitKeys=urlMapperService.getIds(url);
  const[fkS,fkR]=(toSplitKeys?? '').split('|').map(Number);
  return inject(ArticleService).getRubriqueArticle(fkS,fkR).pipe(map((data)=>{
    const tmpData = data as unknown as Article;
    const articles = tmpData['data'] as unknown as  ArticleDetail[];
    return articles ?? null;
  }));

};
