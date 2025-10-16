import { Sport } from './../../../../../../libs/common/src/lib/models/sport.model';
import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ArticleService } from '@wkpcamer/services/articles';
import { ArticleForIndexService } from '../../shared/services/article-for-index.service';
import { isPlatformBrowser } from '@angular/common';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { ArticleDetail, SportDetail } from '@wkpcamer/models';
import { ArticleComponent } from '../article/article.component';
import { HeaderCarouselComponent } from "../../shared/components/header-carousel/header-carousel.component";
import { AdMoneytizerComponent } from "../../shared/components/ad-moneytizer/ad-moneytizer.component";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { AdsenseService } from '../../shared/services/adsense.service';
import { filter } from 'rxjs';
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MegaMenuModule,
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    HeaderCarouselComponent,
    AdMoneytizerComponent,
    AdsenseComponent
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit ,AfterViewInit{


  isBrowser=signal(false);
  carouselArticles:ArticleDetail[]=[];
  filteredCarouselArticles = signal<ArticleDetail[]>([]);


  articleService=inject(ArticleService);
  articleItemsService=inject(ArticleForIndexService);
  platformId = inject(PLATFORM_ID);
  activatedRoute=inject(ActivatedRoute);
  sportBehaviorService=inject(SportBehaviorService);
  adsenseService=inject(AdsenseService);
  router=inject(Router);

  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;

    this.router.events.pipe(filter(event=> event instanceof NavigationEnd)).subscribe(()=>{
      this.adsenseService.resetAds();
    });

    this.articleItemsService.updateState(this.activatedRoute.snapshot.data['accueilList']);
    this.articleService.getSportArticle().subscribe({
      next:(data)=>{
        const tmpData=data as unknown as Sport[];

        const sport=tmpData?.[0]?.data as unknown as SportDetail[];

        if(sport.length>10){
          sport.slice(0,10)
        }
        this.sportBehaviorService.updateState(sport);
      },
      error:(err)=>console.log(err)
    })
  }

  ngAfterViewInit(): void {
     this.articleItemsService.state$.subscribe({
      next:(data)=>{
        this.filteredCarouselArticles.set(data.slice(0,20));

      }
     })
  }

}
