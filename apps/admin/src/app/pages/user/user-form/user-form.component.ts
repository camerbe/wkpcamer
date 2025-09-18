import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { UserService } from '@wkpcamer/actions';
import { IsExpiredService } from '@wkpcamer/users';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'admin-user-form',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TableModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule
],
  providers:[
    MessageService,ConfirmationService
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  messageService=inject(MessageService);
  userService=inject(UserService);
  isExpiredService=inject(IsExpiredService);
  activatedRoute=inject(ActivatedRoute)
  fb = inject(FormBuilder);
  route=inject(Router);
  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.id=this.activatedRoute.snapshot.params["id"];
    this.isAddMode=!this.id;
    this.initializeForm();
    this.id=this.activatedRoute.snapshot.params['id'];
    this.isAddMode=!this.id;
    // if(!this.isAddMode){
      if(!this.isAddMode){
        this.activatedRoute.data.subscribe({
          next:(data) =>{
            const user =data["user"];
            const resData=user["data"]
            this.userForm.patchValue(resData);
          }
        });
      }
    // }
  }
  initializeForm() {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      role: ['', [Validators.required]],

    });
  }

  get nom(){
    return this.userForm.get('nom');
  }
  get prenom(){
    return this.userForm.get('prenom');
  }
  get email(){
    return this.userForm.get('email');
  }
  get role(){
    return this.userForm.get('role');
  }

  onSubmit() {
    if (this.userForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.userForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    if (this.isAddMode){
      this.userService.create(this.userForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Vidéo créé avec succès'
          });
          this.route.navigate(['/admin/user']);
        },
        error: (err) => {
          console.error('Error creating Vidéo', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de la vidéo'
          });
        }
      });
    }
    else{

       this.userService.patch(this.id,this.userForm.value).subscribe({
          next:(data)=>{
            this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Rédacteur mise à jour avec succès'
          });
          this.route.navigate(['/admin/user']);
          },
          error: (err) => {
          console.error('Error creating rédacteur', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour du rédacteur'
          });
        }
       });
    }
  }
  goBack() {
    this.route.navigate(['/admin/user'])
  }

}
