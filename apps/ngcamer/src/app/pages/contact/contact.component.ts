import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DebatDroitComponent } from "../../shared/components/debat-droit/debat-droit.component";
import { ViralizeAdComponent } from "../../shared/components/viralize-ad/viralize-ad.component";
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
import { RecaptchaModule,RecaptchaFormsModule  } from 'ng-recaptcha';
import { CONFIG } from '@wkpcamer/config';
import { SocialMedia } from "../../shared/components/social-media/social-media";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { TaboolaService } from '../../shared/services/taboola.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-contact',
  imports: [
    DebatDroitComponent,
    ViralizeAdComponent,
    Divider,
    Card,
    AdsenseComponent,
    DataView,
    TagModule,
    ToastModule,
    ReactiveFormsModule,
    InputText,
    TextareaModule,
    RecaptchaModule,
    RecaptchaFormsModule ,
    SocialMedia,
    RouterLink
],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  private readonly isBrowser=signal(false);

  sportBehaviorService=inject(SportBehaviorService);
  platformId = inject(PLATFORM_ID);
  private readonly taboolaService=inject(TaboolaService)
  private readonly router=inject(Router);

  /**
   *
   */
  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        this.taboolaService.newPageLoad();
        this.loadTaboolaWidget(event.urlAfterRedirects);
      });
    
  }
   private loadTaboolaWidget(url: string) {
    this.taboolaService.setPageDetails('article', url);
    this.taboolaService.loadWidget(
      'thumbnails-a',
      'taboola-below-article-thumbnails',
      'Below Article Thumbnails',
      'mix'
    );

  }

  fb = inject(FormBuilder);

  get recaptchaReactive() {
    return this.contactForm.get('recaptchaReactive');
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
    
  }
}
