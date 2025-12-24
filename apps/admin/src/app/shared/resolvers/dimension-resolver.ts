import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DimensionsService } from '@wkpcamer/actions';
import { PubDimension} from '@wkpcamer/models';

export const dimensionResolver: ResolveFn<PubDimension|null> = (route) => {
    const id= route.params["id"];
    if (!id) return null;
    return inject(DimensionsService).show(id)
};
