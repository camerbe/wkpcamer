import { ButtonModule } from 'primeng/button';
import { Component, inject, Input, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SlugifyService } from '../../services/slugify.service';

@Component({
  selector: 'app-related-articles',
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
  templateUrl: './related-articles.component.html',
  styleUrl: './related-articles.component.css'
})
export class RelatedArticlesComponent {

  @Input () relatedArticles: ArticleDetail[] = [];

  responsiveOptions = [
    {
      breakpoint: '1024px',  // tablettes/petits laptops
      numVisible: 2,
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



  slugifyService=inject(SlugifyService);
  router=inject(Router);

  gotoArticle(rubrique:string,sousrubrique:string,slug: string) {
    this.router.navigateByUrl('/',{ skipLocationChange: true }).then(()=>{
      this.router.navigate(['/'+this.slugifyService.slugify(rubrique)+'/'+this.slugifyService.slugify(sousrubrique),slug])
    });
  }
}
