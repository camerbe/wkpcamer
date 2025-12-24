import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RubriqueService } from '@wkpcamer/actions';
import { Rubrique, RubriqueDetail } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  selector: 'admin-app-rubrique-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './rubrique-list.component.html',
  styleUrl: './rubrique-list.component.css'
})
export class RubriqueListComponent implements OnInit{


  rubrique!:Rubrique;
  rubriques:RubriqueDetail[]=[];

  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  rubriqueService=inject(RubriqueService)
  activatedRoute=inject(ActivatedRoute);


  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.rubriques=data["rubriques"]
      }
    })
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer cette rubrique ?",
      header:"Suppression de rubrique",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.rubriqueService.delete(id).subscribe({
          next:(data)=>{
            this.rubriques.filter((d)=>d.idrubrique!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Rubrique supprimée avec succès'
            })

          },
           error:(err)=>{
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
  load() {
    return this.rubriqueService.getAll().subscribe({
        next: (data) => {
            const tmpData = data as unknown as Rubrique;
            this.rubriques = tmpData["data"] as unknown as RubriqueDetail[];
              //console.log(this.articles);
        },
        error: (err) => {
            console.error('Error fetching articles', err);
        }
      });
  }

  onCreate() {
    this.router.navigate(['/admin/rubrique/form']);
  }

}
