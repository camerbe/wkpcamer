import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CONFIG } from '@wkpcamer/config';
import { User } from '@wkpcamer/models';
import { DataService } from '@wkpcamer/services';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<User> {
  constructor() {
    super(inject(HttpClient), CONFIG.apiUrl + `/users`);
  }
  activeUser(resource:any){
      return this.httpClient.post<User>(CONFIG.apiUrl+`/users/activate/user/`,JSON.stringify(resource));
  }
  getUserByEmail(email:string){
      return this.httpClient.get<User>(CONFIG.apiUrl+`/users/activating/${email}`);
  }
}
