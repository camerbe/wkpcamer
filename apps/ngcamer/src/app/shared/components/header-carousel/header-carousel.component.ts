import { Component, inject, Input, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { SlugifyService } from '../../services/slugify.service';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PubSkyscraperComponent } from "../pub-skyscraper/pub-skyscraper.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

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
    RouterModule,
    PubSkyscraperComponent
],
  templateUrl: './header-carousel.component.html',
  styleUrl: './header-carousel.component.css'
})
export class HeaderCarouselComponent implements OnDestroy   {


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
  imageSize = 'medium';
  breakpointSubscription!: Subscription;

   slugifyService=inject(SlugifyService);
   router=inject(Router);
   platformId = inject(PLATFORM_ID);
   breakpointObserver=inject(BreakpointObserver);
   //breakpointSubscription=inject(Subscription);

   constructor() {
    this.breakpointSubscription =this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web
    ]).subscribe({
      next: (result) => {
        if (result.breakpoints[Breakpoints.Handset]) {
          this.imageSize = 'small';
        }
        else if (result.breakpoints[Breakpoints.Tablet]) {
          this.imageSize = 'medium';
        }
        else if (result.breakpoints[Breakpoints.Web]) {
          this.imageSize = 'large';
        }
      }
    });

  }

   gotoArticle(slug: string,rubrique:string,sousrubrique:string) {
    this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
      this.router.navigate(['/'+this.slugifyService.slugify(rubrique)+'/'+this.slugifyService.slugify(sousrubrique),slug]);
    });
  }

  getSizes(): string {
    return '(max-width: 768px) 100vw, 50vw';
  }

  ngOnDestroy(): void {
    this.breakpointSubscription.unsubscribe();
  }

}
