import { Component } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MegaMenuModule,
    HeaderComponent,
    FooterComponent,    
    RouterOutlet
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
