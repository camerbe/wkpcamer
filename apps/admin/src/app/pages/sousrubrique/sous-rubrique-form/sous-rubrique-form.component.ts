import { Rubrique, RubriqueDetail } from '@wkpcamer/models';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SousRubriqueService } from '@wkpcamer/actions';
import { IsExpiredService } from '@wkpcamer/users';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
  selector: 'admin-sous-rubrique-form',
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
    SelectModule
  ],
  providers:[
    MessageService
  ],
  templateUrl: './sous-rubrique-form.component.html',
  styleUrl: './sous-rubrique-form.component.css'
})
export class SousRubriqueFormComponent implements OnInit {

  sousrubriqueForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;
  rubriques:RubriqueDetail[]=[];

  messageService=inject(MessageService);
  sousrubriqueService=inject(SousRubriqueService);
  isExpiredService=inject(IsExpiredService);
  activatedRoute=inject(ActivatedRoute)
  fb = inject(FormBuilder);
  route=inject(Router);

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.id=this.activatedRoute.snapshot.params["id"];
    this.isAddMode=!this.id;
    this.initializeForm();
    this.getRubriques();
    if(!this.isAddMode){
        this.activatedRoute.data.subscribe({
          next:(data)=>{
            const tmpData=data["sousrubrique"];
            const resData=tmpData["data"];
            // console.log(resData);
            this.sousrubriqueForm.patchValue(resData);
          }
        });

    }
  }
  getRubriques() {
    return this.sousrubriqueService.getRubrique().subscribe({
          next:(data)=>{
            const tmpData=data as unknown as Rubrique;
            this.rubriques=tmpData["data"] as unknown as RubriqueDetail[];
           // console.log(this.pubDimensions)
          }
        });
  }
  initializeForm() {
    this.sousrubriqueForm = this.fb.group({
      sousrubrique: ['', [Validators.required]],
      fkrubrique: ['', [Validators.required]],

    });
  }
  get sousrubrique(){
    return this.sousrubriqueForm.get('sousrubrique');
  }
  get fkrubrique(){
    return this.sousrubriqueForm.get('fkrubrique');
  }

  onChangeRubrique($event: SelectChangeEvent) {
    const idrubrique = $event.value;
    this.sousrubriqueForm.patchValue({ fkrubrique: idrubrique });
  }
  goBack() {
    this.route.navigate(['/admin/sousrubrique'])
  }
  onSubmit() {
    if (this.sousrubriqueForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.sousrubriqueForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    if (this.isAddMode){
      this.sousrubriqueService.create(this.sousrubriqueForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Sous Rubrique créé avec succès'
          });
          this.route.navigate(['/admin/sousrubrique']);
        },
        error: (err) => {
          console.error('Error creating Sous Rubrique', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de la Sous Rubrique'
          });
        }
      });
    }
    else{

       this.sousrubriqueService.patch(this.id,this.sousrubriqueForm.value).subscribe({
          next:(data)=>{
            this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Sous Rubrique mise à jour avec succès'
          });
          this.route.navigate(['/admin/sousrubrique']);
          },
          error: (err) => {
          console.error('Error creating Sous Rubrique', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour la Sous Rubrique'
          });
        }
       });
    }
  }
}
