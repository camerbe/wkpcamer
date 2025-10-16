import { CONFIG } from '@wkpcamer/config';
import { Component, Injectable } from '@angular/core';
import { DataService } from '@wkpcamer/services'; // Update the path as needed
import { Article, SousRubrique,Pays, Sport } from '@wkpcamer/models'; // Update the path
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
  public getMostReadRubriqueByCountry(fksousrubrique:number,fkpays:string){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/most/${fksousrubrique}/${fkpays}`);
  }
  public getArticle(){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/news`);
  }
  public getArticleBySlug(slug:string){
    return this.httpClient.get<Article>(CONFIG.apiUrl+`/articles/slug/${slug}`);
  }
  public getSameRubrique(fksousrubrique:number){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/same/${fksousrubrique}`);
  }
  public getSportArticle(){
    return this.httpClient.get<Sport[]>(CONFIG.apiUrl+`/articles/sport`);
  }

  public getRubriqueArticle(fksousrubrique:number,fkrubrique:number){
    return this.httpClient.get<Article[]>(CONFIG.apiUrl+`/articles/${fksousrubrique}/${fkrubrique}`);
  }
}
