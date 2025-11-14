import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { EventService } from '@wkpcamer/actions';
import { CONFIG } from '@wkpcamer/config';
import { IsExpiredService } from '@wkpcamer/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import tinymce from 'tinymce';

@Component({
  selector: 'admin-event-form',
  imports: [
    CardModule,
    ToolbarModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    TableModule,
    DatePickerModule,
    EditorComponent,
    SelectModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers:[
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' },
    MessageService,ConfirmationService,DatePipe
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements OnInit {


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
		let cmsURL = `${CONFIG.apiUrl}/laravel-filemanager?editor=${fieldname}`;
		cmsURL += (filetype == 'image') ? '&type=Images' : '&type=Files';

    if (filetype === 'image') {
      cmsURL += '&type=Images';
    } else if (filetype === 'media') {
      cmsURL += '&type=Medias';
    } else {
      cmsURL += '&type=Files';
    }

			tinymce?.activeEditor?.windowManager.openUrl({
			  url: cmsURL,
			  title: 'Camer.be',
			  width: x * 0.8,
			  height: y * 0.8,
			  onMessage: (api: any, message: any) => {
         let currentUrl = message.content;
        if (currentUrl.includes('/api/storage')) {
          currentUrl = currentUrl.replace('/api/storage', '/storage');
        }
        callback(currentUrl);
        api.close();

			  }
		});
	}
  };

  eventForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;

  fb = inject(FormBuilder);
  eventService = inject(EventService);
  route=inject(Router);
  messageService = inject(MessageService);
  activatedRoute=inject(ActivatedRoute);
  datePipe=inject(DatePipe);
  isExpiredService=inject(IsExpiredService)


  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.id=this.activatedRoute.snapshot.params['id'];
    this.isAddMode=!this.id;
    this.initializeForm();
    if(!this.isAddMode){
      this.activatedRoute.data.subscribe({
        next:(data) =>{
          const evt =data["event"];
          const resData=evt["data"]
          resData.eventdate=new Date(this.datePipe.transform(resData.eventdate,'yyyy-MM-dd') || '');
          this.eventForm.patchValue(resData);
        }
      })
    }
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      eventdate: ['', [Validators.required]],
      affiche : ['', [Validators.required]],
      imageheight : [''],
      imagewidth : [''],

    });
  }
  get eventdate(){
    return this.eventForm.get("eventdate");
  }
  get affiche(){
    return this.eventForm.get("affiche");
  }
  get imageheight(){
    return this.eventForm.get("imageheight");
  }
  get imagewidth(){
    return this.eventForm.get("imagewidth");
  }

  goBack() {
    this.route.navigate(['/admin/event'])
  }
  onSubmit() {
    if (this.eventForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.eventForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    if (this.isAddMode){
      this.eventService.create(this.eventForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Evènement créé avec succès'
          });
          this.route.navigate(['/admin/event']);
        },
        error: (err) => {
          console.error('Error creating evènement', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de l\'évènement'
          });
        }
      });
    }
    else{
       this.eventForm.patchValue({eventdate: this.datePipe.transform(this.eventForm.value.eventdate,'yyyy-MM-dd')});
       this.eventService.patch(this.id,this.eventForm.value).subscribe({
          next:(data)=>{
            this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Evènement mis à jour avec succès'
          });
          this.route.navigate(['/admin/event']);
          },
          error: (err) => {
          console.error('Error creating évènement', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour l\'évènement'
          });
        }
       });
    }
  }
}
