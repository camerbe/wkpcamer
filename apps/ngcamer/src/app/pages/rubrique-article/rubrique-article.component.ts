import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { UrlMapperService } from './../../shared/services/url-mapper.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ArticleService } from '@wkpcamer/services/articles';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ArticleDetail, SportDetail } from '@wkpcamer/models';
import { SlugifyService } from '../../shared/services/slugify.service';
import { Meta, Title } from '@angular/platform-browser';
import { KeywordAndHashtagService } from '@wkpcamer/users';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SousrubriqueArticleComponent } from "../../shared/components/sousrubrique-article/sousrubrique-article.component";
import { DividerModule } from 'primeng/divider';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { SocialMedia } from "../../shared/components/social-media/social-media";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-rubrique-article',
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TagModule,
    SousrubriqueArticleComponent,
    DividerModule,
    ViralizeAdComponent,
    DebatDroitComponent,
    SocialMedia
],
  templateUrl: './rubrique-article.component.html',
  styleUrl: './rubrique-article.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RubriqueArticleComponent implements OnInit {

  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
//SIGNALS
  readonly label = signal('');
  readonly rubriqueArticles = signal<ArticleDetail[]>([]);

// Services
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly sportBehaviorService = inject(SportBehaviorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly taboolaService=inject(TaboolaService)

  readonly urlMapperService = inject(UrlMapperService);
  readonly metaService = inject(Meta);
  readonly titleService = inject(Title);
  readonly keywordAndHashtagService = inject(KeywordAndHashtagService);


  //url!:string;
  rubrique!:string;
  sousrubrique!:string;
  fkrubrique!:number
  fksousrubrique!:number
  toSplitKeys!:string|null;
  //isBrowser=signal(false);
  dateModif=signal('');
  //label=signal('');
  keyWord=signal('');

  acticleService=inject(ArticleService);
  platformId = inject(PLATFORM_ID);
  slugifyService=inject(SlugifyService);

  router=inject(Router);

  cdr=inject(ChangeDetectorRef);

  /**
   *
   */
  constructor() {
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
  private loadTaboolaWidget(url: string) {
     this.taboolaService.setPageDetails('article', url);
    this.taboolaService.loadWidget(
      'thumbnails-a',
      'taboola-below-article-thumbnails',
      'Below Article Thumbnails',
      'mix'
    );
  }
  ngOnInit(): void {

    if (!this.isBrowser) return;

    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ menuList }) => {
        this.rubriqueArticles.set(menuList);
        this.label.set(menuList[0]?.sousrubrique?.sousrubrique ?? '');
      });


  }


  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

}
