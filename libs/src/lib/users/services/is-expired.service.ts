import { LocalstorageService } from '@wkpcamer/users';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@wkpcamer/auth';

@Injectable({
  providedIn: 'root'
})
export class IsExpiredService {
  localstorageService=inject(LocalstorageService);
  authService=inject(AuthenticationService);

  isExpired():boolean{
    const token=this.localstorageService.getToken();
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    return this.tokenExpired(+decodedToken.expires_in);
  }

  logout(){
    this.authService.logout()
  }
  tokenExpired(expiration:number):boolean{
      return Math.floor(new Date().getTime()/1000)>=expiration
  }

  currentUser():string{
    const token=this.localstorageService.getToken();
    const decodedToken=JSON.parse(atob(token.split('.')[1] )) ;
    return decodedToken.fullName;
  }


}
