import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PubTypeService } from '@wkpcamer/actions';

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
  selector: 'admin-type-pub-form',
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
  templateUrl: './type-pub-form.component.html',
  styleUrl: './type-pub-form.component.css'
})
export class TypePubFormComponent implements OnInit {


  typepubForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  messageService=inject(MessageService);
  pubtypeService=inject(PubTypeService);
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
            const tmpData=data["typepub"];
            const resData=tmpData["data"];
            this.typepubForm.patchValue(resData);
          }
        });

    }

  }
  initializeForm() {
    this.typepubForm = this.fb.group({
      pubtype: ['', [Validators.required]],

    });
  }

  get pubtype(){
    return this.typepubForm.get('pubtype');
  }

  goBack() {
    this.route.navigate(['/admin/typepub'])
  }
  onSubmit() {
    if (this.typepubForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.typepubForm.markAllAsTouched();
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
      this.pubtypeService.create(this.typepubForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Type publicité créé avec succès'
          });
          this.route.navigate(['/admin/typepub']);
        },
        error: (err) => {
          console.error('Error creating Typepub', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de Typepub'
          });
        }
      });
    }
    else {
      this.pubtypeService.patch(this.id,this.typepubForm.value).subscribe({
        next:()=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Typepub mis à jour avec succès'
          });
          this.route.navigate(['/admin/typepub']);
        },
        error: (err) => {
          console.error('Error updating typepub', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour de typepub'
          });
        }
      })
    }
  }
}
