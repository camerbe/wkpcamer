
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '@wkpcamer/auth';


@Component({
  selector: 'admin-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar  {



  /**
   *
   */
  authenticationService = inject(AuthenticationService)




  logout() {
    this.authenticationService.logout() ;
  }

}
