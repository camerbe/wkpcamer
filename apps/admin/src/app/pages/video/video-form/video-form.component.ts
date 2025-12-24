import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '@wkpcamer/actions';
import { IsExpiredService } from '@wkpcamer/shared';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TINYMCE_SCRIPT_SRC, EditorComponent } from '@tinymce/tinymce-angular';
import { CONFIG } from '@wkpcamer/config';
import tinymce from 'tinymce';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-video-form',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TableModule,
    EditorComponent,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule
  ],
  providers:[
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' },
    MessageService,ConfirmationService
  ],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.css'
})
export class VideoFormComponent implements OnInit {

  initImage: EditorComponent['init'] = {
    path_absolute: "/",
    relative_urls: false,
    base_url: '/tinymce',
    menubar: false,
    plugins: ['image', 'media'],
    toolbar: 'image media',
    file_picker_callback: function (callback, value, meta) {

    const x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
		const y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const fieldname=meta['fieldname'];
    const filetype=meta['filetype'];
		let cmsURL = `${CONFIG.siteUrl}/laravel-filemanager?editor=${fieldname}`;
		cmsURL += (filetype == 'image') ? '&type=Images' : '&type=Files';

			tinymce?.activeEditor?.windowManager.openUrl({
			  url: cmsURL,
			  title: 'Camer.be',
			  width: x * 0.8,
			  height: y * 0.8,
			  onMessage: (api: any, message: any) => {
          console.log(message)
				callback(message.content);
				api.close();


			  }
		});
	}
  };
  goBack() {
    this.route.navigate(['/admin/video'])
  }
  onSubmit() {
    if (this.videoForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.videoForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    if (this.isAddMode){
      this.videoService.create(this.videoForm.value).subscribe({
        next:()=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Vidéo créé avec succès'
          });
          this.route.navigate(['/admin/video']);
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

       this.videoService.patch(this.id,this.videoForm.value).subscribe({
          next:()=>{
            this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Vidéo mise à jour avec succès'
          });
          this.route.navigate(['/admin/video']);
          },
          error: (err) => {
          console.error('Error creating vidéo', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour la vidéo'
          });
        }
       });
    }
  }

  videoForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  messageService=inject(MessageService);
  videoService=inject(VideoService);
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
    if(!this.isAddMode){
      if(!this.isAddMode){
        this.activatedRoute.data.subscribe({
          next:(data) =>{
            const video =data["video"];
            const resData=video["data"]
            this.videoForm.patchValue(resData);
          }
        });
      }
    }

  }
  initializeForm() {
    this.videoForm = this.fb.group({
      titre: ['', [Validators.required]],
      video: ['', [Validators.required]],
      typevideo: ['', [Validators.required]],

    });
  }

  get titre(){
    return this.videoForm.get('titre');
  }
  get video(){
    return this.videoForm.get('video');
  }
  get typevideo(){
    return this.videoForm.get('typevideo');
  }

}
