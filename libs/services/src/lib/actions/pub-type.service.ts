import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { TypePub } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class PubTypeService extends DataService<TypePub>{
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/typepubs`);
  }
}
