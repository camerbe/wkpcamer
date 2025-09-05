import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VideoService } from '@wkpcamer/actions';
import { VideoDetail, Video } from '@wkpcamer/models';
import { map } from 'rxjs';

export const videoListResolver: ResolveFn<VideoDetail[]|null> = (route, state) => {
  return  inject(VideoService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as Video;
      const rubs = tmpData['data'] as unknown as  VideoDetail[];
      return rubs ?? null;
  }));
};
