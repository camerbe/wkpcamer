import { LocalstorageService } from '../src/lib/storage/localstorage.service';
import { CONFIG } from '@wkpcamer/config';
import { Credentials, LoggedUser } from '@wkpcamer/models';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// @Component({
//   selector: 'lib-auth',
//   imports: [],
//   templateUrl: './auth.html',
//   styleUrl: './auth.css',
// })
@Injectable({
  providedIn: 'root' //
})
export class AuthenticationService {
  httpClient=inject(HttpClient);
  router=inject(Router);
  localstorageService=inject(LocalstorageService);

  login(credentials:Credentials):Observable<LoggedUser>{
    return this.httpClient.post<LoggedUser>(CONFIG.apiUrl+`/auth/login`,credentials,{withCredentials:true})
  }
  logout():void{
    this.localstorageService.removeToken();
    this.router.navigate(['/login'])
  }
}
