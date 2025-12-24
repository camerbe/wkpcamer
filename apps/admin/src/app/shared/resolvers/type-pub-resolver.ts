import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PubTypeService } from '@wkpcamer/actions';
import { TypePub } from '@wkpcamer/models';

export const typePubResolver: ResolveFn<TypePub|null> = (route) => {
  const id= route.params["id"];
  if (!id) return null;
  return inject(PubTypeService).show(id);
};
