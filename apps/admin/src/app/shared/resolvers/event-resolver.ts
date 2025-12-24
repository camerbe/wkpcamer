import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EventService } from '@wkpcamer/actions';
import { Evenement } from '@wkpcamer/models';

export const eventResolver: ResolveFn<Evenement|null> = (route) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(EventService).show(id);
};
