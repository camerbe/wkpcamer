import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RubriqueService } from '@wkpcamer/actions';
import { IsExpiredService } from '@wkpcamer/shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'admin-app-rubrique-form',
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
    CommonModule
  ],
  providers:[
    MessageService
  ],
  templateUrl: './rubrique-form.component.html',
  styleUrl: './rubrique-form.component.css'
})
export class RubriqueFormComponent implements OnInit {


  rubriqueForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  messageService=inject(MessageService);
  rubriqueService=inject(RubriqueService);
  isExpiredService=inject(IsExpiredService);
  activatedRoute=inject(ActivatedRoute)
  fb = inject(FormBuilder);
  route=inject(Router);

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.id=this.activatedRoute.snapshot.params["id"];
    this.isAddMode=!this.id;
    this.initializeForm()
    if(!this.isAddMode){
        this.activatedRoute.data.subscribe({
          next:(data)=>{
            const tmpData=data["rubrique"];
            const resData=tmpData["data"];
            this.rubriqueForm.patchValue(resData);
          }
        });

    }
  }
  initializeForm() {
    this.rubriqueForm = this.fb.group({
      rubrique: ['', [Validators.required]],

    });
  }

  get rubrique(){
    return this.rubriqueForm.get('rubrique');
  }

  goBack() {
    this.route.navigate(['/admin/rubrique'])
  }
  onSubmit() {
    if (this.rubriqueForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.rubriqueForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }


    //console.log(this.articleForm.value);
    if (this.isAddMode) {

      //this.articleForm?.patchValue({ keyword: this.keyword+', '+this.hashtags});
      this.rubriqueService.create(this.rubriqueForm.value).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Rubrique créé avec succès'
          });
          this.route.navigate(['/admin/rubrique']);
        },
        error: (err) => {
          console.error('Error creating rubrique', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de rubrique'
          });
        }
      });
    }
    else {
      this.rubriqueService.patch(this.id,this.rubriqueForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Rubrique mise à jour avec succès'
          });
          this.route.navigate(['/admin/rubrique']);
        },
        error: (err) => {
          console.error('Error updating rubrique', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour de rubrique'
          });
        }
      })
    }
  }
}
