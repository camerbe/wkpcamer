import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Rubrique } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class RubriqueService extends DataService<Rubrique> {
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/rubriques`);
  }
}
