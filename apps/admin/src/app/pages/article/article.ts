import { LocalstorageService } from '@wkpcamer/users';
import { ArticleService } from '@wkpcamer/services/articles';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ArticleDetail } from '@wkpcamer/models';
import { Article } from '@wkpcamer/models';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-article',
  imports: [CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, DatePipe],
  providers: [ArticleService],
  templateUrl: './article.html',
  styleUrls: ['./article.css']
})
export class ArticleListComponent implements OnInit {



  article!:Article;
  articles:ArticleDetail[]=[];
  userId!:number;

  articleService = inject(ArticleService);
  localstorageService=inject(LocalstorageService);
  route=inject(Router);

  private load(id:number) {
    return this.articleService.getArticleByUser(id).subscribe({
      next: (data) => {
        const tmpData = data as unknown as Article;
        this.articles = tmpData["data"] as unknown as ArticleDetail[];
        //console.log(this.articles);
      },
      error: (err) => {
        console.error('Error fetching articles', err);
      }
    });
  }

  ngOnInit(): void {
    const decodedToken=JSON.parse(atob(this.localstorageService.getToken().split('.')[1] )) ;
    this.userId=+decodedToken.userId;
    this.load(this.userId);
  }
  onCreate() {
    this.route.navigate(['/admin/article/form']);
  }


}


