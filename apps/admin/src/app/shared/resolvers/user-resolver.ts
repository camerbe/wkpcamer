import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '@wkpcamer/actions';
import { User } from '@wkpcamer/models';

export const userResolver: ResolveFn<User|null> = (route, state) => {
    const id= route.params["id"];
    if (!id) return null;
    return inject(UserService).show(id);
};
