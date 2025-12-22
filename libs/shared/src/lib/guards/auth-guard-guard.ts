import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../src/lib/storage/localstorage.service';

export const authGuard: CanActivateFn = () => {
  const router=inject(Router);
  const localstorageService=inject(LocalstorageService)
  const token=localstorageService.getToken();
  if(token){
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    if(!tokenExpired(+decodedToken.expires_in)) return true;
  }
  router.navigate(['/login'])
  return false;
};
function tokenExpired(expiration:number):boolean{
    return Math.floor(new Date().getTime()/1000)>=expiration
}
