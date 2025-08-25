import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from "../sidebar/sidebar";
import { RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'admin-shell',
  imports: [ButtonModule, Sidebar, RouterOutlet, AvatarModule, CardModule],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css']
})
export class Shell {

}
