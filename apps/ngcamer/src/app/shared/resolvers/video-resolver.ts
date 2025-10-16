import { VideoService } from '@wkpcamer/actions';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VideoDetail } from '@wkpcamer/models';
import { catchError, map, of } from 'rxjs';

export const videoResolver: ResolveFn<VideoDetail[]|null> = (route, state) => {
  const video= route.params["video"];
  const videoService = inject(VideoService);
  const source$ =
    video === 'camer'
      ? videoService.VideoCamer()
      : videoService.VideoSopie();
  return source$.pipe(
    map((response: any) => {
      const videos = response?.data as VideoDetail[] | undefined;
      return videos ?? null;
    }),
    catchError(() => of(null))
  );
};
