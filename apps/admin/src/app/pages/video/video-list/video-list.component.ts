import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VideoService } from '@wkpcamer/actions';
import { Video, VideoDetail } from '@wkpcamer/models';
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
  selector: 'admin-video-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent implements OnInit{

  video!:Video;
  videos:VideoDetail[]=[];

  videoService=inject(VideoService);
  activatedRoute=inject(ActivatedRoute);
  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
      this.activatedRoute.data.subscribe({
        next:(data)=>{
          this.videos=data["videos"];
        }
      });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer ce type de publicité ?",
      header:"Suppression de type de publicité",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.videoService.delete(id).subscribe({
          next:()=>{
            this.videos.filter((d)=>d.idvideo!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Vidéo supprimée avec succès'
            })

          },
           error:()=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression de le vidéo'
            })
           }
        })
      }
    })
  }
  load() {
    return this.videoService.getAll().subscribe({
        next: (data) => {
            const tmpData = data as unknown as Video;
            this.videos = tmpData["data"] as unknown as VideoDetail[];
                  //console.log(this.articles);
        },
        error: (err) => {
          console.error('Error fetching events', err);
        }
    });
  }
  onCreate() {
    this.router.navigate(['/admin/video/form']);
  }

}
