import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VideoService } from '@wkpcamer/actions';
import { Video } from '@wkpcamer/models';

export const videoResolver: ResolveFn<Video|null> = (route) => {
 const id= route.params["id"];
  if (!id) return null;
  return inject(VideoService).show(id)
};
