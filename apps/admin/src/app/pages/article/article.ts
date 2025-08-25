import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'admin-article',
  imports: [CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule ],
  templateUrl: './article.html',
  styleUrls: ['./article.css']
})
export class Article {

}
