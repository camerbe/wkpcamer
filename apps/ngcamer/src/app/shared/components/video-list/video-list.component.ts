import { CommonModule, DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { VideoDetail } from '@wkpcamer/models';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-video-list',
  imports: [
    DataViewModule,
    CardModule,
    NgOptimizedImage,
    RouterModule,
    CommonModule,
    ButtonModule,
    TagModule,
    DialogModule
],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent implements OnInit {

  @Input() indexVideos=signal<VideoDetail[]>([]);
    @Input() label=signal('');

  isBrowser=signal(false);
  dateModif=signal('');
  displayVideo =signal(false);
  selectedVideo: any;
  safeVideoUrl = signal<SafeResourceUrl | null>(null);

  platformId = inject(PLATFORM_ID);
  activatedRoute = inject(ActivatedRoute);
  metaService=inject(Meta);
  titleService=inject(Title);
  router=inject(Router);
  sanitizer=inject(DomSanitizer);

  gotoVideo(url: string, titre: string): void {
    if(!this.isBrowser()) return;
   const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.selectedVideo = { titre, url };
    this.safeVideoUrl.set(safeUrl);
    this.displayVideo.set(true);
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    const videoLabel = this.indexVideos()[0].typevideo === 'Camer' ? 'vidéo Camer' : 'vidéo Sopie Prod';
    this.label.set(videoLabel)

     this.dateModif.set(new Date().toISOString().slice(0, 19) + '+00:00') ;
     this.titleService.setTitle(`Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU Vidéo`);

     this.metaService.updateTag({ name: 'description', content: `Camer.be – L’info claire et nette de la diaspora camerounaise. Articles, enquêtes et vidéos sur l’actualité politique, sociale et culturelle du Cameroun et de l’Afrique.` });

     this.metaService.updateTag({ name: 'keywords', content: `cameroun,cameroon,cameroun,cameroon,camer,information,claire,nette,cameroun,cameroon,camer,est,site,diaspora,the,leading,portal,belgium,Vidéo`});

     this.metaService.updateTag({ name: 'og:title', content: `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU Vidéo` });

     this.metaService.updateTag({ name: 'og:description', content: `Camer.be est le site de la diaspora du cameroun. camer.be is the leading portal of cameroon in belgium. L&#039;info claire et nette. Vidéo` });

     this.metaService.updateTag({ name: 'og:image', content: `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });

    this.metaService.updateTag({ name: 'og:image:alt', content: `Logo Camer.be` });

    this.metaService.updateTag({ name: 'og:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });

    this.metaService.updateTag({ name: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'og:locale', content: 'fr_FR' });

    this.metaService.updateTag({ name: 'og:locale:alternate', content: 'en-us' });

    this.metaService.updateTag({ name: 'og:site_name', content: 'Camer.be' });

    this.metaService.updateTag({ name: 'twitter:title', content: `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU Vidéo`})

    this.metaService.updateTag({ name: 'twitter:description', content: `Camer.be est le site de la diaspora du cameroun. camer.be is the leading portal of cameroon in belgium. L&#039;info claire et nette. Vidéo` });

    this.metaService.updateTag({ name: 'twitter:image', content:  `${window.location.protocol}//${window.location.host}/assets/images/logo.png` });

    this.metaService.updateTag({ name: 'twitter:image:alt', content:  `Cameroun,Cameroon Camer.be, l'information claire et nette::Cameroun,Cameroon,CAMEROUN INFO ,CAMEROUN ACTU Vidéo` });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.metaService.updateTag({ name: 'twitter:site', content: '@camer.be' });

    this.metaService.updateTag({ name: 'twitter:creator', content: '@camerbe' });

    this.metaService.updateTag({ name: 'twitter:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });
  }

}
