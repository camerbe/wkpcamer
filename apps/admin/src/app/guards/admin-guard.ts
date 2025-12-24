import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '@wkpcamer/localstorage';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localstorageService=inject(LocalstorageService)
  const token=localstorageService.getToken();
  if(token){
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    //console.log(decodedToken);
    return decodedToken.role==='ADM'?  true : router.navigate(['admin/unauthorize']) ;
  }
  return false;
};


