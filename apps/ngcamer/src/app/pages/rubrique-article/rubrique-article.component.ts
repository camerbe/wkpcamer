import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UrlMapperService } from './../../shared/services/url-mapper.service';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
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
import { SportComponent } from "../../shared/components/sport/sport.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";

import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";

@Component({
  selector: 'app-rubrique-article',
  imports: [
    DataViewModule,
    CardModule,
    RouterModule,
    CommonModule,
    ButtonModule,
    TagModule,
    SousrubriqueArticleComponent,
    DividerModule,
    SportComponent,
    ViralizeAdComponent,
    DebatDroitComponent
],
  templateUrl: './rubrique-article.component.html',
  styleUrl: './rubrique-article.component.css'
})
export class RubriqueArticleComponent implements OnInit,AfterViewInit {


  url!:string;
  rubrique!:string;
  sousrubrique!:string;
  fkrubrique!:number
  fksousrubrique!:number
  toSplitKeys!:string|null;
  isBrowser=signal(false);
  dateModif=signal('');
  label=signal('');
  keyWord=signal('');
  rubriqueArticles=signal<ArticleDetail[]>([]);
  sports=signal<SportDetail[]>([]);

  urlMapperService=inject(UrlMapperService);
  activatedRoute=inject(ActivatedRoute);
  acticleService=inject(ArticleService);
  platformId = inject(PLATFORM_ID);
  slugifyService=inject(SlugifyService);
  metaService=inject(Meta);
  titleService=inject(Title);
  router=inject(Router);
  keywordAndHashtagService=inject(KeywordAndHashtagService);
  sportBehaviorService=inject(SportBehaviorService);
  cdr=inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;


    this.sportBehaviorService.state$.subscribe({
      next:(data:SportDetail[])=>{
        this.sports.set(data.slice(0,10));

      }
    });
  }
  ngAfterViewInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;

    this.activatedRoute.data.subscribe({
      next:data=>{
        this.rubriqueArticles.set(data['menuList']);
        this.label.set(this.rubriqueArticles()[0].sousrubrique.sousrubrique);
        this.cdr.detectChanges();
      }

    });

  }

  wordCount(info:string): number {
    // Remove HTML tags and count words
    const text =info.replace(/<[^>]+>/g, ' ').trim();
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

}
