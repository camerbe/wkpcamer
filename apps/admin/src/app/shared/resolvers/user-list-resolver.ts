import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '@wkpcamer/actions';
import { UserDetail, User } from '@wkpcamer/models';
import { map } from 'rxjs';

export const userListResolver: ResolveFn<UserDetail[]|null> = () => {
   return  inject(UserService).getAll().pipe(map((data)=>{
    const tmpData = data as unknown as User;
      const users = tmpData['data'] as unknown as  UserDetail[];
      return users ?? null;
  }));
};
