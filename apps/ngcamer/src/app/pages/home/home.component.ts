import { Component, inject, OnInit, signal } from '@angular/core';
import { Article, ArticleDetail } from '@wkpcamer/models';
import { ArticleService } from '@wkpcamer/services/articles';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule  } from "primeng/dataview";
import { CardModule } from "primeng/card";
import { SlugifyService } from '../../shared/services/slugify.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [DataViewModule, CardModule,NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  listIndex=signal<ArticleDetail[]>([]);
  layout: 'grid' | 'list' = 'grid';

  articleService=inject(ArticleService);
  activatedReoute=inject(ActivatedRoute);
  slugifyService=inject(SlugifyService);

  ngOnInit(): void {
    this.activatedReoute.data.subscribe({
      next:(data)=>{
        this.listIndex.set(data["accueilList"]);
        console.log(this.listIndex());
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

}
