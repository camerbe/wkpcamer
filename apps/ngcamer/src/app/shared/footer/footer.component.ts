import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ArchivesComponent } from "../components/archives/archives.component";
import { Router, RouterLink } from '@angular/router';
import { FooterService } from '../services/footer.service';

@Component({
  selector: 'app-footer',
  imports: [
    ScrollTopModule,
    ArchivesComponent,
    RouterLink
],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent  {


  isBrowser = signal(false);
  private platformId = inject(PLATFORM_ID);
  private footerService= inject(FooterService);
  private router=inject(Router);
  private scroller=inject(ViewportScroller);
  private destroyRef = inject(DestroyRef);

  currentYear = new Date().getFullYear();

  articleWeekList=this.footerService.weekList;
  articleMonthList=this.footerService.monthList;
  articleYearList= this.footerService.yearList;

  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));

    if (this.isBrowser()) {

     this.footerService.loadFooterData().subscribe();
    }

  }


   gotoHome() {
    this.router.navigateByUrl('/',{ skipLocationChange: true }).then(()=>{
      this.router.navigate(['/accueil']);
      this.scroller.scrollToPosition([0, 10]);
    })
  }


}
