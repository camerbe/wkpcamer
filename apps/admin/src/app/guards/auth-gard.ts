import { LocalstorageService } from '@wkpcamer/users';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGard implements CanActivate {
  router=inject(Router);
  localstorageService=inject(LocalstorageService)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const token=this.localstorageService.getToken();
    if(token){
      const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
      if(!this.tokenExpired(decodedToken.expires_in)) return true;
    }
    this.router.navigate(['/login'])
    return false;
  }
  tokenExpired(expiration:number):boolean{
    return Math.floor(new Date().getTime()/1000)>=expiration
  }

}
