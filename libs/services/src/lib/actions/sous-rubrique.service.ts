import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Rubrique, SousRubrique } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class SousRubriqueService extends DataService<SousRubrique> {
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/sousrubriques`);
  }
  getRubrique(){
      return this.httpClient.get<Rubrique[]>(CONFIG.apiUrl+`/sousrubriques/rubrique/list`);
  }
}
