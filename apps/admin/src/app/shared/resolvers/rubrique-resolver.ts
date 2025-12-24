import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RubriqueService } from '@wkpcamer/actions';
import { Rubrique } from '@wkpcamer/models';

export const rubriqueResolver: ResolveFn<Rubrique|null> = (route) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(RubriqueService).show(id);
};
