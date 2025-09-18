import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '@wkpcamer/models';
import { UserService } from '@wkpcamer/actions';

export const changePasswordResolver: ResolveFn<User|null> = (route, state) => {
  const email= route.params["email"];
    if (!email) return null;
    return inject(UserService).getUserByEmail(email);
};
