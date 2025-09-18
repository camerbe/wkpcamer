import { Component } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MegaMenuModule,

  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
