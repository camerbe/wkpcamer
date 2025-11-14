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
  public VideoCamer(){
    return this.httpClient.get<Video[]>(CONFIG.apiUrl+`/videos/videocamer`);
  }
  public VideoSopie(){
    return this.httpClient.get<Video[]>(CONFIG.apiUrl+`/videos/videosem`);
  }
  public getVideos(resource :string){
    return this.httpClient.get<Video[]>(CONFIG.apiUrl+`/videos/videofind/${resource}`);
  }
  public getOneVideos(resource :string){
    return this.httpClient.get<Video>(CONFIG.apiUrl+`/videos/${resource}`);
  }
}
