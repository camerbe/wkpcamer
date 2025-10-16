import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SportDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sport',
  imports: [
    CardModule,
    ButtonModule,
    CarouselModule,
    TagModule,
    DividerModule,
    CommonModule,
    NgOptimizedImage,
    RouterModule
  ],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css'
})
export class SportComponent {

  @Input () sportArticles: SportDetail[] = [];
  responsiveOptions = [
    {
      breakpoint: '1024px',  // tablettes/petits laptops
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',   // mobiles en mode paysage
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',   // petits mobiles
      numVisible: 1,
      numScroll: 1
    }
  ];

   router=inject(Router);
  gotoArticle(url: string) {
    this.router.navigate([`https://camer-sport.com/${url}`])
  }
}
