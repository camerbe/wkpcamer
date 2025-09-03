import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { LocalstorageService, IsExpiredService } from '@wkpcamer/users';


@Component({
  selector: 'admin-shell',
  imports: [ButtonModule, Sidebar, RouterOutlet, AvatarModule, CardModule],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css']
})
export class Shell implements OnInit{


  localstorageService=inject(LocalstorageService)
  currentYear: number = new Date().getFullYear();
  currentUser!:string
  isExpiredService=inject(IsExpiredService)

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.currentUser=this.isExpiredService.currentUser();
  }
  logout() {
    this.isExpiredService.logout();
  }
}
