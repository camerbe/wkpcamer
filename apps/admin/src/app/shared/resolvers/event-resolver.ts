import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EventService } from '@wkpcamer/actions';
import { Event } from '@wkpcamer/models';

export const eventResolver: ResolveFn<Event|null> = (route, state) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(EventService).show(id);
};
