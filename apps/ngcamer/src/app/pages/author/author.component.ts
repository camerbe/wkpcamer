import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { SlugifyService } from '../../shared/services/slugify.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ViralizeAdComponent } from '../../shared/components/viralize-ad/viralize-ad.component';
import { DebatDroitComponent } from '../../shared/components/debat-droit/debat-droit.component';
import { SocialMedia } from '../../shared/components/social-media/social-media';
import { AuthorSearchComponent } from '../../shared/components/author-search/author-search.component';
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-author',
  imports: [
    DataViewModule,
    CardModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ViralizeAdComponent,
    DebatDroitComponent,
    SocialMedia,
    AuthorSearchComponent
  ],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorComponent implements OnInit {

  /****************SIGNALS***************** */
    private readonly isBrowser = signal(false);
    protected readonly authorName = signal('');
    protected authorArticles = signal<ArticleDetail[]>([]);
  /****************SERVICES***************** */
    private readonly acticleService=inject(ArticleService);
    private readonly slugifyService=inject(SlugifyService);
    private readonly activatedRoute=inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly taboolaService=inject(TaboolaService)
    private readonly router=inject(Router);


  constructor() {
    this.isBrowser.set(isPlatformBrowser(inject(PLATFORM_ID)));
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        this.taboolaService.newPageLoad();
        this.loadTaboolaWidget(event.urlAfterRedirects);
      });

  }



  ngOnInit(): void {
    if (!this.isBrowser()) return;

    const author=this.activatedRoute.snapshot.paramMap.get('auteur');

    this.activatedRoute.data.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({authorArticlesList})=>{
        this.authorArticles.set(authorArticlesList);
        this.authorName.set(this.authorArticles()[0]?.auteur || author || 'Auteur inconnu');
    });
  }
  private loadTaboolaWidget(url: string) {
    this.taboolaService.setPageDetails('article', url);
    this.taboolaService.loadWidget(
      'thumbnails-a',
      'taboola-below-article-thumbnails',
      'Below Article Thumbnails',
      'mix'
    );

  }

}
