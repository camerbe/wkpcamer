import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '@wkpcamer/actions';
import { EventDetail, Evenement } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/users';
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
  selector: 'admin-event-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule,DatePipe
  ],
   providers:[
    MessageService,ConfirmationService,DatePipe
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent implements OnInit{


  event!:Evenement;
  events:EventDetail[]=[];

  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  eventService=inject(EventService)
  activatedRoute=inject(ActivatedRoute);

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.events=data["events"];
      }
    });
  }

  private load() {
    return this.eventService.getAll().subscribe({
      next: (data) => {
        const tmpData = data as unknown as Evenement;
        this.events = tmpData["data"] as unknown as EventDetail[];
            //console.log(this.articles);
        },
        error: (err) => {
          console.error('Error fetching events', err);
        }
      });
  }


  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer cette évènement ?",
      header:"Suppression d'évènement",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.eventService.delete(id).subscribe({
          next:(data)=>{
            this.events.filter((d)=>d.idevent!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Evènement supprimé avec succès'
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
  onCreate() {
    this.router.navigate(['/admin/event/form']);
  }
}
