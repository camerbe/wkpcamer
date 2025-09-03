import { DimensionListComponent } from './dimension.component';
import { ActivatedRoute, Router } from '@angular/router';
import { IsExpiredService } from '@wkpcamer/users';
import { DimensionsService } from '@wkpcamer/actions';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PubDimensionDetail } from '@wkpcamer/models';

@Component({
  selector: 'admin-dimension-form',
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
  templateUrl: './dimension-form.component.html',
  styleUrl: './dimension-form.component.css',
})
export class DimensionFormComponent implements OnInit{


  dimensionForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  messageService=inject(MessageService);
  dimensionService=inject(DimensionsService);
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
            const resData=data["dimension"];
            const dim=resData["data"];
            this.dimensionForm.patchValue(dim)
          }
        });
          // this.dimensionService.show(this.id).subscribe({
          //   next:(data)=>{
          //     const resData=data["data"] as  unknown as PubDimensionDetail
          //     this.dimensionForm.patchValue(resData);
          //   }
          // });
        }

  }

  private initializeForm(): void {
    this.dimensionForm = this.fb.group({
      dimension: ['', [Validators.required]],

    });
  }
  get dimension(){
    return this.dimensionForm.get('dimension');
  }

  goBack() {
    this.route.navigate(['/admin/dimension'])
  }
  onSubmit() {
    if (this.dimensionForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.dimensionForm.markAllAsTouched();
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
      this.dimensionService.create(this.dimensionForm.value).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Dimension créé avec succès'
          });
          this.route.navigate(['/admin/dimension']);
        },
        error: (err) => {
          console.error('Error creating dimension', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de dimension'
          });
        }
      });
    }
    else {
      this.dimensionService.patch(this.id,this.dimensionForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Dimension mise à jour avec succès'
          });
          this.route.navigate(['/admin/dimension']);
        },
        error: (err) => {
          console.error('Error updating dimension', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour de dimension'
          });
        }
      })
    }
  }
}
