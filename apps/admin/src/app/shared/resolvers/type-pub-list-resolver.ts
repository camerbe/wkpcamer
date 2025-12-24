import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PubTypeService } from '@wkpcamer/actions';
import { TypePub, TypePubDetail } from '@wkpcamer/models';
import { map } from 'rxjs';

export const typePubListResolver: ResolveFn<TypePubDetail[]|null> = () => {
  return  inject(PubTypeService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as TypePub;
      const typepubs = tmpData['data'] as unknown as  TypePubDetail[];
      return typepubs ?? null;
  }));
};
