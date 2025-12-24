import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PubService } from '@wkpcamer/actions';
import { Pub } from '@wkpcamer/models';

export const pubResolver: ResolveFn<Pub|null> = (route) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(PubService).show(id);
};
