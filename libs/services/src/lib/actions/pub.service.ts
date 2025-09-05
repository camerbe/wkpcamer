import { TypePub } from './../../../../common/src/lib/models/type-pub.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Pub, PubDimension } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class PubService extends DataService<Pub> {
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/pubs`);
  }
  getPubDimension(){
    return this.httpClient.get<PubDimension[]>(CONFIG.apiUrl+`/pubs/dimensions`);
  }
  getPubType(){
    return this.httpClient.get<TypePub[]>(CONFIG.apiUrl+`/pubs/pubtypes`);
  }
}
