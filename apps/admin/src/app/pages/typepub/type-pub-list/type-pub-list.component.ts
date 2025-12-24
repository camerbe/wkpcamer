import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { PubTypeService } from '@wkpcamer/actions';
import { TypePub, TypePubDetail } from '@wkpcamer/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IsExpiredService } from '@wkpcamer/shared';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-type-pub-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './type-pub-list.component.html',
  styleUrl: './type-pub-list.component.css'
})
export class TypePubListComponent implements OnInit {


  typepub!:TypePub;
  typepubs:TypePubDetail[]=[];

  pubtypeService=inject(PubTypeService);
  activatedRoute=inject(ActivatedRoute);
  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.typepubs=data["typepubs"];
      }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer ce type de publicité ?",
      header:"Suppression de type de publicité",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.pubtypeService.delete(id).subscribe({
          next:()=>{
            this.typepubs.filter((d)=>d.idpubtype!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Type de publicité supprimé avec succès'
            })

          },
           error:()=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de dimension'
            })
           }
        })
      }
    })
  }
  onCreate() {
    this.router.navigate(['/admin/typepub/form']);
  }
  private load() {
      return this.pubtypeService.getAll().subscribe({
        next: (data) => {
          const tmpData = data as unknown as TypePub;
          this.typepubs = tmpData["data"] as unknown as TypePubDetail[];
              //console.log(this.articles);
          },
          error: (err) => {
            console.error('Error fetching events', err);
          }
        });
    }

}
