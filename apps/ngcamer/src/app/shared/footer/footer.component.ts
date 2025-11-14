import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ArchivesComponent } from "../components/archives/archives.component";
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    ScrollTopModule,
    ArchivesComponent
],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {


  isBrowser = signal(false);
  platformId = inject(PLATFORM_ID);
  articleService = inject(ArticleService);
  cdr=inject(ChangeDetectorRef);
  currentYear = new Date().getFullYear();

  articleWeekList: ArticleDetail[] = [];
  articleMonthkList: ArticleDetail[] = [];
  articleYearList: ArticleDetail[] = [];

  router=inject(Router)
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    forkJoin({
      weekData: this.articleService.getArticleByPeriod('week'),
      monthData: this.articleService.getArticleByPeriod('month'),
      yearData: this.articleService.getArticleByPeriod('year')
    }).subscribe({
      next:(result)=>{
        const tmpWeek=result.weekData as unknown as Article;
        this.articleWeekList = tmpWeek["data"] as unknown as ArticleDetail[];
        const tmpMonth=result.monthData as unknown as Article;
        this.articleMonthkList = tmpMonth["data"] as unknown as ArticleDetail[];
        const tmpYear=result.yearData as unknown as Article;
        this.articleYearList = tmpYear["data"] as unknown as ArticleDetail[];
        this.cdr.detectChanges();

      }
    });


  }

   gotoHome() {
    this.router.navigateByUrl('/',{ skipLocationChange: true }).then(()=>{
      this.router.navigate(['/accueil']);
    })
  }


}
