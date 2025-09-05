import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { Video } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class VideoService extends DataService<Video>{
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/videos`);
  }
}
