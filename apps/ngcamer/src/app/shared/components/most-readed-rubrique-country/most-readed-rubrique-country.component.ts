import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { OrderListModule } from 'primeng/orderlist';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SlugifyService } from '../../services/slugify.service';

@Component({
  selector: 'app-most-readed-rubrique-country',
  imports: [
    DataViewModule,
    CardModule,
    NgOptimizedImage,
    RouterModule,
    OrderListModule ,
    CommonModule,
    ButtonModule,
    TagModule,
    ChipModule,
    BadgeModule,
    OverlayBadgeModule

  ],
  templateUrl: './most-readed-rubrique-country.component.html',
  styleUrl: './most-readed-rubrique-country.component.css'
})
export class MostReadedRubriqueCountryComponent implements OnInit{


  @Input() mostReadedArticles: ArticleDetail[] = [];
  slugifyService=inject(SlugifyService);

  isBrowser=signal(false);


  platformId = inject(PLATFORM_ID);
  router=inject(Router);

  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
  }
  gotoArticle(rubrique: string,sousrubrique: string,slug: string) {
    this.router.navigateByUrl('/',{skipLocationChange: true}).then(()=>{
      this.router.navigate(['/'+this.slugifyService.slugify(rubrique)+'/'+this.slugifyService.slugify(sousrubrique),slug]);
    });
  }
}
