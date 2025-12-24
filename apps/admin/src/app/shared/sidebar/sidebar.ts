
import { Component } from '@angular/core';
import { RouterLink,RouterLinkActive, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '@wkpcamer/auth';


@Component({
  selector: 'admin-sidebar',
  imports: [RouterLink,RouterLinkActive,RouterModule],
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
