import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StatsService } from '@wkpcamer/actions';
import { Stats } from '@wkpcamer/models';
import { map } from 'rxjs';

export const statsResolver: ResolveFn<Stats|null> = (route, state) => {
  return  inject(StatsService).getStats().pipe(map((data)=>{
    const tmpData = data as unknown as Stats;
    return tmpData ?? null;
  }));
};
