import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@wkpcamer/actions';
import { User, UserDetail } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/users';
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
  selector: 'admin-user-list',
  imports: [
    CardModule, ToolbarModule, ButtonModule, InputIconModule,IconFieldModule,InputTextModule,TableModule, TooltipModule,RouterModule,  ConfirmDialogModule,ToastModule
  ],
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  user!:User;
  users:UserDetail[]=[];

  userService=inject(UserService);
  activatedRoute=inject(ActivatedRoute);
  router=inject(Router);
  confirmationService=inject(ConfirmationService);
  messageService=inject(MessageService);
  isExpiredService=inject(IsExpiredService)
  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
        next:(data)=>{
          this.users=data["users"];
        }
    });
  }

  onDelete(id: number) {
    this.confirmationService.confirm({
      message:"Voulez-vous supprimer ce rédacteur ?",
      header:"Suppression de rédacteur",
      icon:"pi pi-exclamation-triangle",
      accept:()=>{
        this.userService.delete(id).subscribe({
          next:(data)=>{
            this.users.filter((d)=>d.id!=id)
            this.load()
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Rédacteur supprimé avec succès'
            })

          },
           error:(err)=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression du rédacteur'
            })
           }
        })
      }
    })
  }
  load() {
    return this.userService.getAll().subscribe({
        next: (data) => {
          const tmpData = data as unknown as User;
          this.users = tmpData["data"] as unknown as UserDetail[];
                      //console.log(this.articles);
        },
        error: (err) => {
          console.error('Error fetching events', err);
        }
      });
  }
  onCreate() {
    this.router.navigate(['/admin/user/form']);
  }

}


