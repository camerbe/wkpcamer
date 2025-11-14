import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { DataService } from '@wkpcamer/services';
import { Evenement} from '@wkpcamer/models';

@Injectable({
  providedIn: 'root'
})
export class EventService extends DataService<Evenement>{

  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/events`);
  }
  public getEvent(){
    return this.httpClient.get<Evenement>(CONFIG.apiUrl+`/events/list`);
  }
}
