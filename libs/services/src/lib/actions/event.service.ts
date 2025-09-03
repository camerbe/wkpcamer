import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { DataService } from '@wkpcamer/services';
import { Event} from '@wkpcamer/models';

@Injectable({
  providedIn: 'root'
})
export class EventService extends DataService<Event>{

  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/events`);
  }
}
