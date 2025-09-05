import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SousRubriqueService } from '@wkpcamer/actions';
import { SousRubrique } from '@wkpcamer/models';

export const sousRubriqueResolver: ResolveFn<SousRubrique|null> = (route, state) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(SousRubriqueService).show(id);
};
