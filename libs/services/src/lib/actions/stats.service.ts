import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Stats } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService extends DataService<Stats>{
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/stats`);
  }
  getStats(): Observable<Stats> {
    return this.httpClient.get<Stats>(CONFIG.apiUrl + `/stats`);
  }
}
