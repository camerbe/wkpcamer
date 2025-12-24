import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PubDimension, PubDimensionDetail } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/shared';
import { DimensionsService } from '@wkpcamer/actions';
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
  selector: 'admin-dimension-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
  templateUrl: './dimension.component.html',
  styleUrl: './dimension.component.css',
  providers:[
    MessageService,ConfirmationService
  ],
})
export class DimensionListComponent implements OnInit {


  dimension!:PubDimension;
  dimensions:PubDimensionDetail[]=[];

  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  dimensionService=inject(DimensionsService)
  activatedRoute=inject(ActivatedRoute);

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.dimensions=data["dimensions"]
      }
    })
  }

  private load() {
    return this.dimensionService.getAll().subscribe({
      next: (data) => {
        const tmpData = data as unknown as PubDimension;
        this.dimensions = tmpData["data"] as unknown as PubDimensionDetail[];
          //console.log(this.articles);
      },
      error: (err) => {
        console.error('Error fetching articles', err);
      }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer cette dimension ?",
      header:"Suppression de dimension",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.dimensionService.delete(id).subscribe({
          next:()=>{
            this.dimensions.filter((d)=>d.idpubdimension!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Dimension supprimée avec succès'
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
    this.router.navigate(['/admin/dimension/form']);
  }
}
