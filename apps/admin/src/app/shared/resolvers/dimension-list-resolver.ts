import { inject, TemplateRef } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DimensionsService } from '@wkpcamer/actions';
import { PubDimension,PubDimensionDetail } from '@wkpcamer/models';
import { map } from 'rxjs';

export const dimensionListResolver: ResolveFn<PubDimensionDetail[]| null> = (route, state) => {

  return  inject(DimensionsService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as PubDimension;
      const dimensions = tmpData['data'] as unknown as  PubDimensionDetail[];
      return dimensions ?? null;
  }));
};
