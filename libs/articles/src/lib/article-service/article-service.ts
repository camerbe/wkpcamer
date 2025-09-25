import { CONFIG } from '@wkpcamer/config';
import { Component, Injectable } from '@angular/core';
import { DataService } from '@wkpcamer/services'; // Update the path as needed
import { Article, SousRubrique,Pays } from '@wkpcamer/models'; // Update the path
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

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
  static getArticle(arg0: string): import("@angular/router").MaybeAsync<Article | import("@angular/router").RedirectCommand | null> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/articles`);
  }
  getCountries(){
    return this.httpClient.get<Pays[]>(CONFIG.apiUrl+`/articles/pays/countries`);
  }
  getRubriques(){
    return this.httpClient.get<SousRubrique[]>(CONFIG.apiUrl+`/articles/rubriques/categorie`);
  }
  getArticleByUser(userid:number){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/adm/${userid}`);
  }
  public getArticle(){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/news`);
  }
}
