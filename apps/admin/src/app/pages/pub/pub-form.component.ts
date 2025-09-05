import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PubService } from '@wkpcamer/actions';
import { CONFIG } from '@wkpcamer/config';
import { PubDimension, PubDimensionDetail, TypePub, TypePubDetail } from '@wkpcamer/models';
import { IsExpiredService } from '@wkpcamer/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import tinymce from 'tinymce';

@Component({
  selector: 'admin-pub-form',
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
  templateUrl: './pub-form.component.html',
  styleUrl: './pub-form.component.css',
})
export class PubFormComponent implements OnInit {

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

  pubForm!: FormGroup;
  id!:number;
  isAddMode!:boolean;
  pubTypes:TypePubDetail[]=[];
  pubDimensions:PubDimensionDetail[]=[];

  fb = inject(FormBuilder);
  pubService = inject(PubService);
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
    this.getDimensions();
    this.getTypes();
    this.id=this.activatedRoute.snapshot.params['id'];
    this.isAddMode=!this.id;
    if(!this.isAddMode){
      if(!this.isAddMode){
        this.activatedRoute.data.subscribe({
          next:(data) =>{
            const evt =data["pub"];
            const resData=evt["data"]
            resData.endpubdate=new Date(this.datePipe.transform(resData.endpubdate,'yyyy-MM-dd') || '');
            this.pubForm.patchValue(resData);
          }
        })
      }
    }
  }

  private initializeForm(): void {
    this.pubForm = this.fb.group({
      endpubdate: ['', [Validators.required]],
      pub : ['', [Validators.required]],
      fktype : ['', [Validators.required]],
      href : ['', [Validators.required]],
      fkdimension : ['', [Validators.required]],
      imageheight : [''],
      imagewidth : [''],
      editor : ['',[Validators.required]],

    });
  }
  get endpubdate(){
    return this.pubForm.get("endpubdate");
  }
  get pub(){
    return this.pubForm.get("pub");
  }
  get fktype(){
    return this.pubForm.get("fktype");
  }
  get fkdimension(){
    return this.pubForm.get("fkdimension");
  }
  get imageheight(){
    return this.pubForm.get("imageheight");
  }
  get imagewidth(){
    return this.pubForm.get("imagewidth");
  }
  get editor(){
    return this.pubForm.get("editor");
  }
  get href(){
    return this.pubForm.get("href");
  }

  goBack() {
    this.route.navigate(['/admin/pub'])
  }
  onSubmit() {
    if (this.pubForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
      this.pubForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    if (this.isAddMode){
      this.pubService.create(this.pubForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Publicité créé avec succès'
          });
          this.route.navigate(['/admin/pub']);
        },
        error: (err) => {
          console.error('Error creating Pub', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de la pub'
          });
        }
      });
    }
    else{
       this.pubForm.patchValue({endpubdate: this.datePipe.transform(this.pubForm.value.endpubdate,'yyyy-MM-dd')});
       this.pubService.patch(this.id,this.pubForm.value).subscribe({
          next:(data)=>{
            this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Publicité mise à jour avec succès'
          });
          this.route.navigate(['/admin/pub']);
          },
          error: (err) => {
          console.error('Error creating pub', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour la publicité'
          });
        }
       });
    }

  }

  onChangeDimension($event: SelectChangeEvent) {
    const idpubdimension = $event.value;
    this.pubForm.patchValue({ fkdimension: idpubdimension });
    // const selected = this.pubDimensions.find(r => r.idpubdimension === idpubdimension);

    // if (selected) {
    //   this.pubForm.patchValue({ fkrubrique: selected.fkrubrique });
    // }
  }
  onChangeTypePub($event: SelectChangeEvent) {
    const id = $event.value;
    this.pubForm.patchValue({ fktype: id });
  }
  private getDimensions(){
    return this.pubService.getPubDimension().subscribe({
      next:(data)=>{
        const tmpData=data as unknown as PubDimension;
        this.pubDimensions=tmpData["data"] as unknown as PubDimensionDetail[];
       // console.log(this.pubDimensions)
      }
    });
  }
  private getTypes(){
    return this.pubService.getPubType().subscribe({
      next:(data)=>{
        const tmpData=data as unknown as TypePub;
        this.pubTypes=tmpData["data"] as unknown as TypePubDetail[];
       // console.log(this.pubDimensions)
      }
    });
  }

}
