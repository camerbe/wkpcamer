import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PubService } from '@wkpcamer/actions';
import { Pub, PubDetail } from '@wkpcamer/models';
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
  selector: 'admin-pub-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule,DatePipe
  ],
  providers:[
    MessageService,ConfirmationService,DatePipe
  ],
  templateUrl: './pub-list.component.html',
  styleUrl: './pub-list.component.css',
})
export class PubListComponent implements OnInit {


  pub!:Pub;
  pubs:PubDetail[]=[];

  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  pubService=inject(PubService)
  activatedRoute=inject(ActivatedRoute);



  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.pubs=data["pubs"];
      }
    });
  }

  private load() {
      return this.pubService.getAll().subscribe({
        next: (data) => {
          const tmpData = data as unknown as Pub;
          this.pubs = tmpData["data"] as unknown as PubDetail[];
              //console.log(this.articles);
          },
          error: (err) => {
            console.error('Error fetching pub', err);
          }
        });
  }

  onDelete(arg0: any) {
  throw new Error('Method not implemented.');
  }
  onCreate() {
    this.router.navigate(['/admin/pub/form']);
  }
}
