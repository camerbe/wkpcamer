import { VideoService } from '@wkpcamer/actions';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Video, VideoDetail } from '@wkpcamer/models';
import { catchError, map, of } from 'rxjs';

export const videoResolver: ResolveFn<VideoDetail[]|null> = (route, state) => {
  const video= route.params["video"];
  if(!video) return null;

  return  inject(VideoService).getVideos(video).pipe(
    map((data)=>{
      const tmpData = data as unknown as Video;
      const videos = tmpData['data'] as unknown as  VideoDetail[];
      return videos ?? null;
      //

    }),
    catchError((error)=>{
      console.error('Error fetching video data:', error);
      return of (null);
    })
  );

};
