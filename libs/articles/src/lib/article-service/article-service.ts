import { CONFIG } from '@wkpcamer/config';
import { Injectable } from '@angular/core';
import { DataService } from '@wkpcamer/services'; // Update the path as needed
import { Article, SousRubrique,Pays, Sport, CacheEntry } from '@wkpcamer/models'; // Update the path
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';

// @Component({
//   selector: 'lib-article-service',
//   imports: [],
//   templateUrl: './article-service.html',
//   styleUrl: './article-service.css',
// })


@Injectable({
  providedIn: 'root'
})
export class ArticleService extends DataService<Article> {

  relatedArticlesCache = new Map<number, CacheEntry<Article[]>>();
  mostReadCache = new Map<string, CacheEntry<Article[]>>();
  oneRubriqueArticleCache = new Map<string, CacheEntry<Article[]>>();
  rubriqueArticleCache = new Map<string, CacheEntry<Article[]>>();
  newsArticleCache = new Map<string, CacheEntry<Article[]>>();
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/articles`);
  }

  override create(resource: Article): Observable<Article> {
    return super.create(resource).pipe(
      tap((createdArticle)=>{
        const tmpdata =createdArticle as unknown as Article;
        const insertedArticle=tmpdata["data"];
        const fksousrubrique=insertedArticle.fksousrubrique;
        const fkrubrique=insertedArticle.fkrubrique;
        const cacheKey = `${fksousrubrique}_${fkrubrique}`;
        const newsCacheKey=`news`;
        this.newsArticleCache.delete(newsCacheKey);
        this.relatedArticlesCache.delete(fksousrubrique);
        this.rubriqueArticleCache.delete(cacheKey)
      })
    );
  }
  getCountries(){
    return this.httpClient.get<Pays[]>(CONFIG.apiUrl+`/articles/pays/countries`);
  }
  getRubriques(){
    return this.httpClient.get<SousRubrique[]>(CONFIG.apiUrl+`/articles/rubriques/categorie`);
  }
  public getArticleByUser(userid:number){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/adm/user/${userid}`);
  }
  public getMostReadRubriqueByCountry(fksousrubrique:number,fkpays:string){
     const cacheKey = `${fksousrubrique}_${fkpays}`;
     const cachedEntry = this.mostReadCache.get(cacheKey);
     if(cachedEntry && cachedEntry.timestamp > Date.now()){
      return cachedEntry.data$;
     }
      //Mise en cache
    const data$=this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/most/${fksousrubrique}/${fkpays}`)
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    const newCacheEntry: CacheEntry<Article[]> = {
      data$: data$,
      timestamp: Date.now() + CONFIG.cacheTTL.long // Le nouveau timestamp d'expiration est dans 1 heure
    };
     // 3. Stockage de l'Observable mis en cache
    this.mostReadCache.set(cacheKey, newCacheEntry);
    return  data$;
    //return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/most/${fksousrubrique}/${fkpays}`);
  }
  public getArticle(){
    const cacheKey = `news`;
    const cachedEntry = this.newsArticleCache.get(cacheKey);
    if(cachedEntry && cachedEntry.timestamp > Date.now()){
      return cachedEntry.data$;
    }
    const data$= this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/news`).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    const newCacheEntry: CacheEntry<Article[]> = {
      data$: data$,
      timestamp: Date.now() + CONFIG.cacheTTL.long
    };
    this.newsArticleCache.set(cacheKey, newCacheEntry);
    return  data$;
  }
  public getArticleBySlug(slug:string){
    return this.httpClient.get<Article>(CONFIG.apiUrl+`/articles/slug/${slug}`);
  }
  public getSameRubrique(fksousrubrique:number){
    const cachedEntry = this.relatedArticlesCache.get(fksousrubrique);
    if(cachedEntry && cachedEntry.timestamp > Date.now()){
      return cachedEntry.data$;
    }
    //Mise en cache
    const data$=this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/same/${fksousrubrique}`)
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    // 2. Préparation et stockage de l'entrée du cache
    const newCacheEntry: CacheEntry<Article[]> = {
      data$: data$,
      timestamp: Date.now() + CONFIG.cacheTTL.long // Le nouveau timestamp d'expiration est dans 1 heure
    };
    // 3. Stockage de l'Observable mis en cache
    this.relatedArticlesCache.set(fksousrubrique, newCacheEntry);
    return  data$;
  }
  public getSportArticle(){
    return this.httpClient.get<Sport[]>(CONFIG.apiUrl+`/articles/sport`);
  }

  public getRubriqueArticle(fksousrubrique:number,fkrubrique:number){
    const cacheKey=`${fksousrubrique}_${fkrubrique}`;
    const cachedEntry = this.rubriqueArticleCache.get(cacheKey);
    if(cachedEntry && cachedEntry.timestamp > Date.now()){
      return cachedEntry.data$;
    }
    const data$= this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/${fksousrubrique}/${fkrubrique}`).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );

    const newCacheEntry: CacheEntry<Article[]> = {
      data$: data$,
      timestamp: Date.now() + CONFIG.cacheTTL.long// Le nouveau timestamp d'expiration est dans 1 heure
    };
    this.rubriqueArticleCache.set(cacheKey, newCacheEntry);
    return  data$;
  }
  public getOneRubriqueArticle(fksousrubrique:number,fkrubrique:number){
    const cacheKey=`${fksousrubrique}_${fkrubrique}`;
    const cachedEntry = this.oneRubriqueArticleCache.get(cacheKey);
    if(cachedEntry && cachedEntry.timestamp > Date.now()){
      return cachedEntry.data$;
    }
    const data$= this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/one/${fksousrubrique}/${fkrubrique}`).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );

     // 2. Préparation et stockage de l'entrée du cache
    const newCacheEntry: CacheEntry<Article[]> = {
      data$: data$,
      timestamp: Date.now() + CONFIG.cacheTTL.long // Le nouveau timestamp d'expiration est dans 1 heure
    };
     // 3. Stockage de l'Observable mis en cache
    this.oneRubriqueArticleCache.set(cacheKey, newCacheEntry);
    return  data$;
  }
  public getArticleByPeriod(period:string){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/period/${period}`);
  }
}
