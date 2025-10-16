import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { SlugifyService } from '../../services/slugify.service';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header-carousel',
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
  templateUrl: './header-carousel.component.html',
  styleUrl: './header-carousel.component.css'
})
export class HeaderCarouselComponent    {


  @Input() carouselArticles: ArticleDetail[] = [];
   isBrowser=signal(false);
   responsiveOptions = [
    {
      breakpoint: '1024px',  // tablettes/petits laptops
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '768px',   // mobiles en mode paysage
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',   // petits mobiles
      numVisible: 1,
      numScroll: 1
    }
  ];

   slugifyService=inject(SlugifyService);
   router=inject(Router);
   platformId = inject(PLATFORM_ID);


   gotoArticle(slug: string,rubrique:string,sousrubrique:string) {
    this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
      this.router.navigate(['/'+this.slugifyService.slugify(rubrique)+'/'+this.slugifyService.slugify(sousrubrique),slug]);
    });
  }

}
