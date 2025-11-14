import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { PaysDetail, SousRubriqueDetail, Pays,SousRubrique, ArticleDetail } from '@wkpcamer/models';
import { SelectModule } from 'primeng/select';
// Update the import path to the correct location of ArticleService
import { ArticleService } from '@wkpcamer/services/articles';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectChangeEvent } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { KeywordAndHashtagService, LocalstorageService, IsExpiredService } from '@wkpcamer/users';
import { CONFIG } from '@wkpcamer/config';
import tinymce from 'tinymce';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'admin-article-form',
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
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: '/tinymce/tinymce.min.js' },
    ArticleService,MessageService,DatePipe
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css'
})
export class ArticleFormComponent implements OnInit,AfterViewInit {



  // init: EditorComponent['init'] = {

  //   path_absolute: "/",
  //   relative_urls: false,
  //   base_url: '/tinymce',
  //   //suffix: '.min',
  //   height: 450,
  //   menubar: 'file edit view insert format tools table help',
  //   toolbar_sticky: false,
  //   //images_upload_credentials: true,
  //   file_picker_callback: function (callback, value, meta) {

  //   const x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
	// 	const y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  //   const fieldname=meta['fieldname'];
  //   const filetype=meta['filetype'];
	// 	let cmsURL = `${CONFIG.siteUrl}/laravel-filemanager?editor=${fieldname}`;
	// 	cmsURL += (filetype == 'image') ? '&type=Images' : '&type=Files';
  //   //const token = (document.querySelector('input[name="_token"]') as HTMLInputElement)?.value;
  //   //console.log(token);
  //   //cmsURL += `&_token=${token}`;
	// 		tinymce?.activeEditor?.windowManager.openUrl({
	// 		  url: cmsURL,
	// 		  title: 'Camer.be',
	// 		  width: x * 0.8,
	// 		  height: y * 0.8,

	// 		  onMessage: (api: any, message: any) => {
  //         callback(message.content);
  //         api.close();
	// 		  }


	// 	});
	// },


  //   plugins: [
  //       'image', 'media', 'tools', 'link', 'advlist',
  //       'autolink', 'lists', 'table', 'wordcount', 'code', 'searchreplace'
  //   ],
  //   toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table mergetags blockquote'
  // };


  // initImage: EditorComponent['init'] = {
  //   menubar: false,
  //   plugins: ['image', 'media'],
  //   toolbar: 'image media',
  //   file_picker_callback: function (callback, value, meta) {

  //   const x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
	// 	const y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  //   const fieldname=meta['fieldname'];
  //   const filetype=meta['filetype'];
	// 	let cmsURL = `${CONFIG.siteUrl}/laravel-filemanager?editor=${fieldname}`;
	// 	cmsURL += (filetype == 'image') ? '&type=Images' : '&type=Files';

	// 		tinymce?.activeEditor?.windowManager.openUrl({
	// 		  url: cmsURL,
	// 		  title: 'Camer.be',
	// 		  width: x * 0.8,
	// 		  height: y * 0.8,
	// 		  onMessage: (api: any, message: any) => {
	// 			callback(message.content);
	// 			api.close();


	// 		  }
	// 	});
	// }
  // };

  articleForm!: FormGroup;
  countries:PaysDetail[]=[];
  sousRubriques:SousRubriqueDetail[]=[];
  userId!:number;
  id!:number;
  isAddMode!:boolean;
  tinymce: any;
  isTinyMceLoaded = false;
  init: any= {};
  initImage: any= {};


  fb = inject(FormBuilder);
  articleService = inject(ArticleService);
  route=inject(Router);
  messageService = inject(MessageService);
  localstorageService=inject(LocalstorageService);
  activatedRoute=inject(ActivatedRoute);
  datePipe=inject(DatePipe);
  hashtagService=inject(KeywordAndHashtagService)
  isExpiredService=inject(IsExpiredService)



  loadCountries() {
    return this.articleService.getCountries().subscribe({
      next: (data:Pays[]) => {
        const tmpData = data as unknown as Pays;
        this.countries = tmpData["data"] as unknown as PaysDetail[];
      },
      error: (err: unknown) => {
        console.error('Error fetching countries', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les pays'
        });
      }
    });
  }

  loadSousRubriques() {
    return this.articleService.getRubriques().subscribe({
      next: (data:SousRubrique[]) => {
        const tmpData = data as unknown as SousRubrique;
        this.sousRubriques = tmpData["data"] as unknown as SousRubriqueDetail[];
      },
      error: (err:HttpErrorResponse) => {
        console.error('Error fetching sous rubriques', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les rubriques'
        });
      }
    });
  }

  private initializeForm(): void {
    this.articleForm = this.fb.group({
      auteur: ['', [Validators.required]],
      source: ['', [Validators.required]],
      dateparution: ['', [Validators.required]],
      fksousrubrique : ['', [Validators.required]],
      fkrubrique : ['', [Validators.required]],
      fkuser : [''],
      fkpays: ['', [Validators.required]],
      titre: ['', [Validators.required, Validators.maxLength(100)]],
      keyword: ['', [this.keywordsValidator()]],
      hashtags: ['', [this.hashtagsValidator()]],
      info: ['', [Validators.required]],
      image: ['', [Validators.required]],
      imagewidth:[],
      imageheight:[]
    });
  }

  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.id=this.activatedRoute.snapshot.params['id'];
    this.isAddMode=!this.id;

    this.initTinyMceConfig();
    this.initializeForm();
    this.loadCountries();
    this.loadSousRubriques()
    if(!this.isAddMode){

      this.activatedRoute.data.subscribe({
        next:(data)=>{

          const tmpData=data["article"];
          const resData=tmpData["data"]  as ArticleDetail;

          resData.dateparution=new Date(this.datePipe.transform(resData.dateparution,'yyyy-MM-dd HH:mm:ss') || '');

          this.articleForm.patchValue(resData);
          this.articleForm.patchValue({
            hashtags:this.hashtagService.extractHashtags(resData.keyword),
            keyword:this.hashtagService.removeHashtags(resData.keyword)
          });
        }
      });


    }
  }

  onSubmit() {

    if (this.articleForm.invalid) {
      
      this.articleForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }
    const decodedToken=JSON.parse(atob(this.localstorageService.getToken().split('.')[1] )) ;
    this.userId=+decodedToken.userId;
    this.articleForm?.patchValue({ fkuser: this.userId });
    //console.log(this.articleForm.value);
    if (this.isAddMode) {

      //this.articleForm?.patchValue({ keyword: this.keyword+', '+this.hashtags});
      this.articleService.create(this.articleForm.value).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Article créé avec succès'
          });
          this.route.navigate(['/admin/article']);
        },
        error: (err) => {
          console.error('Error creating article', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la création de l\'article'
          });
        }
      });
    }
    else {
      this.articleForm.patchValue({dateparution: this.datePipe.transform(this.articleForm.value.dateparution,'yyyy-MM-dd HH:mm:ss')});
      //console.log(this.articleForm.value);
      this.articleService.patch(this.id,this.articleForm.value).subscribe({
        next:(data)=>{
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Article mis à jour avec succès'
          });
          this.route.navigate(['/admin/article']);
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la mise à jour l\'article'
          });
        }
      })
    }
    //
    //console.log(this.articleForm.valid);
  }


  goBack() {
    this.route.navigate(['/admin/article']);
  }
  onChangeCountry($event: SelectChangeEvent) {
    const countryId = $event.value;
    this.articleForm.patchValue({ fkpays: countryId });
  }
  onChangeRubrique($event: SelectChangeEvent) {
    const idsousrubrique = $event.value;
    this.articleForm.patchValue({ fksousrubrique: idsousrubrique });
    const selected = this.sousRubriques.find(r => r.idsousrubrique === idsousrubrique);

    if (selected) {
      this.articleForm.patchValue({ fkrubrique: selected.fkrubrique });
    }
  }

  get auteur(){
    return this.articleForm.get('auteur');
  }
  get source(){
    return this.articleForm.get('source');
  }
  get dateparution(){
    return this.articleForm.get('dateparution');
  }
  get fksousrubrique(){
    return this.articleForm.get('fksousrubrique');
  }
  get fkpays(){
    return this.articleForm.get('fkpays');
  }
  get hashtags(){
    return this.articleForm.get('hashtags');
  }
  get titre(){
    return this.articleForm.get('titre');
  }
  get keyword(){
    return this.articleForm.get('keyword');
  }
  get info(){
    return this.articleForm.get('info');
  }
  get image(){
    return this.articleForm.get('image');
  }
  get fkuser(){
    return this.articleForm.get('fkuser');
  }


 hashtagsValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>{
      const value: string = control.value?.trim();
      if (!value) {
        return { hashtags: 'Les hashtags sont requis' };
      }
      const tags = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
      if (tags.length < 3) {
        return { hashtags: 'Au moins 3 hashtags sont requis' };
      }
      const regex = /^#[a-zA-Z0-9]{2,}$/;
      for (const tag of tags) {
        if (!regex.test(tag)) {
          return { hashtags: `Hashtag invalide: ${tag}` };
        }
      }
      return null;
    }
  }

  keywordsValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null =>{
      const value: string = control.value?.trim();
      if (!value) {
        return { required: 'Les mots-clés sont requis.' };
      }
      const keywords = value.split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

      if (keywords.length < 3) {
        return { minKeywords: `Il faut au minimum 3 mots-clés (actuellement ${keywords.length}).` };
      }
      const invalid = keywords.filter(k => k.length < 3);
      if (invalid.length > 0) {
        return { minLengthKeyword: `Chaque mot-clé doit avoir au moins 3 caractères. Mots trop courts : ${invalid.join(', ')}.` };
      }
      return null;
    }
  }
filePickerHandler(callback: any, value: any, meta: any) {
    const x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    const y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

    let cmsURL = `${CONFIG.apiUrl}/laravel-filemanager?editor=${meta.fieldname}`;

    if (meta.filetype === 'image') {
      cmsURL += '&type=Images';
    } else if (meta.filetype === 'media') {
      cmsURL += '&type=Medias';
    } else {
      cmsURL += '&type=Files';
    }


    this.tinymce.activeEditor.windowManager.openUrl({
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
      },
      headers: {
        Authorization: `Bearer ${this.localstorageService.getToken()}`,
      }
    });
  }

  initTinyMceConfig() {
    const baseConfig = {
      path_absolute: "/",
      relative_urls: false,
      base_url: '/tinymce',
      suffix: '.min',
      height: 450,
      file_picker_callback: (callback: any, value: any, meta: any) => {
        this.filePickerHandler(callback, value, meta);
      }
    };
    this.initImage = {
      ...baseConfig,
      menubar: false,
      plugins: ['image', 'media'],
      toolbar: 'image media'
    };
    this.init = {
      ...baseConfig,
      menubar: 'file edit view insert format tools table tc help',
      toolbar_sticky: false,
      plugins: [
        'image', 'media', 'tools', 'link', 'advlist',
        'autolink', 'lists', 'table', 'wordcount', 'code', 'searchreplace'
      ],
      toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table mergetags blockquote'
    };
  };
  async ngAfterViewInit(): Promise<void> {
    try{
      const tinymceModule = await import('tinymce');
      this.tinymce = tinymceModule.default;
      this.isTinyMceLoaded = true;
    }
    catch (error){
      console.error('Error loading tinymce:', error);
      this.isTinyMceLoaded = false;
    }

  }

}
