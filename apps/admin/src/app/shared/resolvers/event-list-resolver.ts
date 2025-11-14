import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EventService } from '@wkpcamer/actions';
import { EventDetail, Evenement} from '@wkpcamer/models';
import { map } from 'rxjs';

export const eventListResolver: ResolveFn<EventDetail[]| null> = (route, state) => {
  return  inject(EventService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as Evenement;
      const events = tmpData['data'] as unknown as  EventDetail[];
      return events ?? null;
  }));
};
