import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'admin-unauthorize',
  imports: [
    PanelModule,CardModule
  ],
  templateUrl: './unauthorize.component.html',
  styleUrl: './unauthorize.component.css'
})
export class UnauthorizeComponent {

}
