import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SousRubriqueService } from '@wkpcamer/actions';
import { SousRubrique, SousRubriqueDetail } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/shared';
import { MessageService, ConfirmationService } from 'primeng/api';
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
  selector: 'admin-sous-rubrique-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
   providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './sous-rubrique-list.component.html',
  styleUrl: './sous-rubrique-list.component.css'
})
export class SousRubriqueListComponent implements OnInit {

  sousrubrique!:SousRubrique;
  sousrubriques:SousRubriqueDetail[]=[];

  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  sousrubriqueService=inject(SousRubriqueService)
  activatedRoute=inject(ActivatedRoute);



  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.sousrubriques=data["sousrubriques"]
      }
    })
  }
  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer cette sousrubrique ?",
      header:"Suppression de sousrubrique",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.sousrubriqueService.delete(id).subscribe({
          next:(data)=>{
            this.sousrubriques.filter((d)=>d.idsousrubrique!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'SousRubrique supprimée avec succès'
            })

          },
           error:(err)=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de sousrubrique'
            })
           }
        })
      }
    })
  }
  load() {
    return this.sousrubriqueService.getAll().subscribe({
        next: (data) => {
          const tmpData = data as unknown as SousRubrique;
          this.sousrubriques = tmpData["data"] as unknown as SousRubriqueDetail[];
                  //console.log(this.articles);
        },
        error: (err) => {
          console.error('Error fetching SousRubrique', err);
        }
    });
  }
  onCreate() {
    this.router.navigate(['/admin/sousrubrique/form']);
  }

}
