import { RubriqueService } from '@wkpcamer/actions';
import { ResolveFn } from '@angular/router';
import { Rubrique, RubriqueDetail } from '@wkpcamer/models';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const rubriqueListResolver: ResolveFn<RubriqueDetail[]|null> = (route, state) => {
  return  inject(RubriqueService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as Rubrique;
      const rubs = tmpData['data'] as unknown as  RubriqueDetail[];
      return rubs ?? null;
  }));
};
