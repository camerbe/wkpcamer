import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { ArticleService } from '@wkpcamer/services/articles';
import { PaysDetail, SousRubriqueDetail, Pays,SousRubrique } from '@wkpcamer/models';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectChangeEvent } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '@wkpcamer/users';

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
    ArticleService,MessageService,
  ],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css'
})
export class ArticleFormComponent implements OnInit {



  init: EditorComponent['init'] = {

    path_absolute: "/",
    relative_urls: false,
    base_url: '/tinymce',
    suffix: '.min',
    height: 450,
    menubar: 'file edit view insert format tools table help',
    toolbar_sticky: false,
    plugins: [
        'image', 'media', 'tools', 'link', 'advlist',
        'autolink', 'lists', 'table', 'wordcount', 'code', 'searchreplace'
    ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table mergetags blockquote'
  };

  initImage: EditorComponent['init'] = {
    menubar: false,
    plugins: ['image', 'media'],
    toolbar: 'image media'
  };

  articleForm!: FormGroup;
  countries:PaysDetail[]=[];
  sousRubriques:SousRubriqueDetail[]=[];
  userId!:number;
  id!:number;
  isAddMode!:boolean;

  fb = inject(FormBuilder);
  articleService = inject(ArticleService);
  route=inject(Router);
  messageService = inject(MessageService);
  localstorageService=inject(LocalstorageService);
  activatedRoute=inject(ActivatedRoute);

  private loadCountries(): void {
    this.articleService.getCountries().subscribe({
      next: (data) => {
        const tmpData = data as unknown as Pays;
        this.countries = tmpData["data"] as unknown as PaysDetail[];
      },
      error: (err) => {
        console.error('Error fetching countries', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les pays'
        });
      }
    });
  }

  private loadSousRubriques(): void {
    this.articleService.getRubriques().subscribe({
      next: (data) => {
        const tmpData = data as unknown as SousRubrique;
        this.sousRubriques = tmpData["data"] as unknown as SousRubriqueDetail[];
      },
      error: (err) => {
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
    this.id=this.activatedRoute.snapshot.params['id'];
    this.isAddMode=!this.id;
    
    this.initializeForm();
    this.loadCountries();
    this.loadSousRubriques()
  }

  onSubmit() {

    if (this.articleForm.invalid) {
      //console.log('Form is invalid', this.articleForm.errors);
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
    console.log(this.articleForm.value);
    if (this.isAddMode) {
      this.articleForm?.patchValue({ keyword: this.keyword+', '+this.hashtags});
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
    //console.log(this.articleForm.value);
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

}
