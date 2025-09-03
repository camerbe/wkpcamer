import { inject, Injectable } from '@angular/core';
import { DataService } from '@wkpcamer/services';
import { CONFIG } from '@wkpcamer/config';
import { HttpClient } from '@angular/common/http';
import { PubDimension} from '@wkpcamer/models';

@Injectable({
  providedIn: 'root'
})
export class DimensionsService extends DataService<PubDimension>{

  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/pubdimensions`);
  }
}
