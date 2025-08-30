import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '@wkpcamer/users';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localstorageService=inject(LocalstorageService)
  const token=localstorageService.getToken();
  if(token){
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    console.log(decodedToken);
    return decodedToken.role==='ADM'?  true : router.navigate(['/login']) ;
  }
  return false;
};


