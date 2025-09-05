import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SousRubriqueService } from '@wkpcamer/actions';
import { SousRubrique, SousRubriqueDetail } from '@wkpcamer/models';
import { map } from 'rxjs';

export const sousRubriqueListResolver: ResolveFn<SousRubriqueDetail[]|null> = (route, state) => {
  return  inject(SousRubriqueService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as SousRubrique;
      const rubs = tmpData['data'] as unknown as  SousRubriqueDetail[];
      return rubs ?? null;
  }));
};
