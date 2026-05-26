
import { IsExpiredService } from '@wkpcamer/shared';
import { LocalstorageService } from '@wkpcamer/localstorage';
import { ArticleService } from '@wkpcamer/services/articles';
import { Component, OnInit, inject, signal } from '@angular/core';
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
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService,MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';


@Component({
  selector: 'admin-article',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, DatePipe,TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule,FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  providers: [ArticleService,ConfirmationService,MessageService],
  templateUrl: './article.html',
  styleUrls: ['./article.css']
  
})
export class ArticleListComponent implements OnInit {



  article!:Article;
  
  userId!:number;
  //id!:number;
  //isAddMode!:boolean;

  /************* SIGNALS****************** */
  protected readonly searchQuery = signal<string>('');
  protected articles = signal<ArticleDetail[]>([]);
  /************* INJECTS****************** */
  private readonly articleService = inject(ArticleService);
  private readonly localstorageService=inject(LocalstorageService);
  //activatedRoute=inject(ActivatedRoute);
  private readonly route=inject(Router);
  private readonly confirmationService=inject(ConfirmationService);
  private readonly messageService=inject(MessageService);
  private readonly isExpiredService=inject(IsExpiredService)
  private readonly activatedRoute=inject(ActivatedRoute);

  private load(id:number) {
    return this.articleService.getArticleByUser(id).subscribe({
      next: (data) => {
        const tmpData = data as unknown as Article;
        const artSignal= tmpData["data"] as unknown as ArticleDetail[];
        this.articles.set(artSignal) 
        //console.log(this.articles);
      },
      error: (err) => {
        console.error('Error fetching articles', err);
      }
    });
  }
  private loadFoundedArticles() {
    const query = this.searchQuery();
    if (query.trim() === '') return;
    return this.articleService.search(query)
      .subscribe({
        next: (data) => {
        const tmpData = data as unknown as Article;
        const artSignal= tmpData["data"] as unknown as ArticleDetail[];
        this.articles.set(artSignal) 
        console.log(this.articles);
      },
      error: (err) => {
        console.error('Error fetching articles', err);
      }
      });

  }
  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    const decodedToken=JSON.parse(atob(this.localstorageService.getToken().split('.')[1] )) ;
    this.userId=+decodedToken.userId;

    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.articles.set(data["ArticleItem"]);
        //console.log(this.articles());
      }
    })

  }

  submitSearch() {
    this.loadFoundedArticles();
  }
  onCreate() {
    this.route.navigate(['/admin/article/form']);
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer cet article ?",
      header:"Suppression d'article",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.articleService.delete(id).subscribe({
          next:()=>{
            this.articles().filter((a)=>a.idarticle!=id)
            this.load(this.userId)
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Article supprimé avec succès'
            })
            //this.route.navigate(['/admin/article'])
          },
           error:()=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de l\'article'
            })
           }
        })
      }
    })
  }

}


