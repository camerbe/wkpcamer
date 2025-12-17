import { SlugifyService } from './../services/slugify.service';

import { ArticleService } from '@wkpcamer/services/articles';
import { ArticleDetail } from '@wkpcamer/models';
import { Component, LOCALE_ID, OnInit, inject, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';


registerLocaleData(localeFr);
@Component({
  selector: 'app-infos',
  imports: [
    DataViewModule,
    CardModule,
    DatePipe,
    ButtonModule,
    RouterModule,
    NgOptimizedImage
],
  providers: [
    ArticleService,
    { provide: LOCALE_ID, useValue: 'fr-FR' },

  ],
  templateUrl: './infos.component.html',
  styleUrl: './infos.component.css'
})
export class InfosComponent implements OnInit {
  // infoCamer:ArticleDetail[]=[];
  infoCamer=signal<ArticleDetail[]>([]);
  infoAutre=signal<ArticleDetail[]>([]);
  pairedItems= signal<{ left: ArticleDetail; right: ArticleDetail }[]>([]);
  layout: 'grid' | 'list' = 'grid';

  protected articleService = inject(ArticleService);
  protected slugifyService = inject(SlugifyService);
  activatedRoute=inject(ActivatedRoute);

  ngOnInit(): void {
    console.log('InfosComponent initialized');
    // this.activatedRoute.data.subscribe({
    //   next: (data) => {
    //     const tmpData = data as unknown as Article;
    //     this.infoCamer =tmpData["data"] as unknown as ArticleDetail[];
    //     this.updatePairedItems();
    //   }
    // })
    // Component initialization logic here
    // this.getAllInfos();
    // this.getAllOtherInfos();
    // this.pairedItems.set(this.getPairedItems()) ;
    // console.log(this.pairedItems);
  }
  getPairedItems() {
    // return this.infoCamer.map((item, index) => (
    //   {
    //     left:item,
    //     right:this.infoAutre[index]
    //   }));;
    // const pairs = this.infoCamer().map((item, index) => ({
    //   left: item,
    //   right: this.infoAutre()[index]
    // }));

    // this.pairedItems.set(pairs);
    //return pairs;

  }
  getAllInfos() {
    //  return this.articleService.getArticle('CM').subscribe({
    //   next: (data) => {
    //     const tmpData = data as unknown as Article;
    //     this.infoCamer.set(tmpData["data"] as unknown as ArticleDetail[]);
    //     this.updatePairedItems();
    //   },
    //   error: (error) => {
    //     console.error('Error fetching articles for CM:', error);
    //   }
    // })
  }
  getAllOtherInfos() {
    //  return this.articleService.getArticle('C').subscribe({
    //   next: (data) => {
    //     const tmpData = data as unknown as Article;
    //     this.infoAutre.set(tmpData["data"] as unknown as ArticleDetail[]);
    //     this.updatePairedItems();
    //   },
    //   error: (error) => {
    //     console.error('Error fetching articles for CM:', error);
    //   }
    // })
  }

  updatePairedItems() {
    // if (this.infoCamer?.length && this.infoAutre?.length) {
    //   this.pairedItems.set(this.getPairedItems()) ;
    //   //console.log('pairedItems après chargement :', this.pairedItems);
    // }
  }



}
