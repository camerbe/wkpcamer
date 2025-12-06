import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";
import { SportComponent } from "../../shared/components/sport/sport.component";
import { Divider } from "primeng/divider";
import { Card } from "primeng/card";
import { AdsenseComponent } from "../../shared/components/adsense/adsense.component";
import { SportDetail } from '@wkpcamer/models';
import { SportBehaviorService } from '../../shared/services/sport-behavior.service';
import { isPlatformBrowser } from '@angular/common';
import { DataView } from "primeng/dataview";
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputText } from "primeng/inputtext";
import { TextareaModule } from 'primeng/textarea';
import { RecaptchaModule } from 'ng-recaptcha';
import { CONFIG } from '@wkpcamer/config';
@Component({
  selector: 'app-contact',
  imports: [
    DebatDroitComponent,
    ViralizeAdComponent,
    SportComponent,
    Divider,
    Card,
    AdsenseComponent,
    DataView,
    TagModule,
    ToastModule,
    ReactiveFormsModule,
    InputText,
    TextareaModule,
    RecaptchaModule
],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  reCaptcha=''
  contactForm!: FormGroup;
  contacts = [
    {
      country: 'Allemagne',
      flag:'de',
      phones: [
        '+49 176 21 96 12 84'
      ]
    },
    {
      country: 'Belgique',
      flag:'be',
      phones: [
        '+32 475 49 20 69',
        '+32 485 39 58 85',
        '+32 484 90 52 54'
      ]
    },
    {
      country: 'Cameroun',
      flag:'cm',
      phones: [
        '+237 95 23 76 38'
      ]
    },
    {
      country: 'France',
      flag:'fr',
      phones: [
        '+33 651 86 05 81'
      ]
    }
  ];

  sports=signal<SportDetail[]>([]);
  isBrowser=signal(false);

  sportBehaviorService=inject(SportBehaviorService);
  platformId = inject(PLATFORM_ID);
  fb = inject(FormBuilder);

  get recaptchaReactive() {
    return this.contactForm.get('auteur');
  }

  get nom() {
    return this.contactForm.get('nom');
  }
  get email() {
    return this.contactForm.get('email');
  }
  get subject() {
    return this.contactForm.get('subject');
  }
  get message() {
    return this.contactForm.get('message');
  }
  parsePhones(phones: string[]): string {
    if (!phones || phones.length === 0) return '';
    return phones.map(p => p.trim()).join('\n');
  }
  initializeForm(): void {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(5)]],
      //prenom: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.maxLength(1000)]],
      recaptchaReactive: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId))
    if(!this.isBrowser()) return;
    this.reCaptcha=CONFIG.siteKeyRecaptchaDev;
    this.initializeForm();
    this.sportBehaviorService.state$.subscribe({
      next:(data:SportDetail[])=>{
        this.sports.set(data.slice(0,10));

      }
    });
  }
}
