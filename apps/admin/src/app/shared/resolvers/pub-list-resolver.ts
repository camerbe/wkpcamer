import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PubService } from '@wkpcamer/actions';
import { Pub, PubDetail } from '@wkpcamer/models';
import { map } from 'rxjs';

export const pubListResolver: ResolveFn<PubDetail[]| null> = (route, state) => {
  return  inject(PubService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as Pub;
      const pubs = tmpData['data'] as unknown as  PubDetail[];
      return pubs ?? null;
  }));
};
