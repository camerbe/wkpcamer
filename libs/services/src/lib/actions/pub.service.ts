import { TypePub } from '@wkpcamer/models';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Pub, PubDetail, PubDimension } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class PubService extends DataService<Pub> {
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/pubs`);
  }
  getPubDimension(){
    return this.httpClient.get<PubDimension[]>(CONFIG.apiUrl+`/pubs/dimension/list`);
  }
  getPubType(){
    return this.httpClient.get<TypePub[]>(CONFIG.apiUrl+`/pubs/pubtype/list`);
  }
  public getRandomPub(dimension:number){
      return this.httpClient.get<Pub>(CONFIG.apiUrl+`/pubs/pubcached/${dimension}`);
  }
}
