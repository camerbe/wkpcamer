import { ButtonModule } from 'primeng/button';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from "primeng/megamenu";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MegaMenu,
    InputTextModule,
    FormsModule,
    InputGroupModule,
    ButtonModule,
    InputGroupAddonModule,
    RouterModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent  {

//searchQuery!:string  ;
  searchQuery = signal<string>('');

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  //items: MegaMenuItem[] | undefined;
  searchTerm = '';

  //router=inject(Router);
  //cdr=inject(ChangeDetectorRef);
  //platformId = inject(PLATFORM_ID);
   readonly items: MegaMenuItem[] = [
    {
        label: 'Accueil',
        icon: 'pi pi-fw pi-home',
        style: { 'color': '#ffffff' },
        items: [
          [
            {
              items:[
                {
                  label: 'Diaspora',
                  icon: 'pi pi-fw pi-users',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/camerounais-du-monde/diaspora")
                  routerLink:"/camerounais-du-monde/diaspora"
                },
                {
                  label: 'Économie',
                  icon: 'pi pi-fw pi-dollar',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/actualites/economie")
                  routerLink: "/actualites/economie"
                },
                {
                  label: 'Religion',
                  icon: 'pi pi-fw pi-crown',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/actualites/religion")},
                  routerLink:"/actualites/religion"
                },
                {
                  label: 'Société',
                  icon: 'pi pi-fw pi-bullseye',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/actualites/societe")
                  routerLink:"/actualites/societe"
                },
                {
                  label: 'Sport',
                  icon: 'pi pi-fw pi-list',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/actualites/sport")
                  routerLink:"/actualites/sport"
                },
                {
                  label: 'Politique',
                  icon: 'pi pi-fw pi-list',
                  styleClass: 'text-gray-500',
                  //command: () => this.navigateTo("/actualites/politique")
                  routerLink:"/actualites/politique"
                }

              ],
              label: 'Actualité & Société & Sport'
            },
          ],
          [
            {
              items:[
                {
                  label: 'FrançaisCamer', icon: 'pi pi-fw pi-ethereum',
                  //command: () => this.navigateTo("/frananglais/francaiscamer")
                  routerLink:"/frananglais/francaiscamer"
                },
                {
                  label: 'Françafrique', icon: 'pi pi-globe pi-prime',
                  //command: () => this.navigateTo("/liens-postcoloniaux/francafrique")
                  routerLink:"/liens-postcoloniaux/francafrique"
                },

                {
                  label: 'Géopolitique', icon: 'pi pi-fw pi-prime',
                  //command: () => this.navigateTo("/monde-pouvoir/geopolitique")
                  routerLink:"/monde-pouvoir/geopolitique"
                },

              ],
              label: 'International'
            },
          ],
          [
            {
              items:[
                {
                  label: 'Insolite', icon: 'pi pi-fw pi-verified',
                  //command: () => this.navigateTo("/actualites/insolite")
                  routerLink:"/actualites/insolite"
                },
                {
                  label: 'Le saviez-vous', icon: 'pi pi-fw pi-bolt',
                  //command: () => this.navigateTo("/fait-curieux/le-saviez-vous")
                  routerLink:"/fait-curieux/le-saviez-vous"
                },
                {
                  label: 'People', icon: 'pi pi-fw pi-users',
                  //command: () => this.navigateTo("/actualites/people")
                  routerLink:"/actualites/people"
                },
                {
                  label: 'Sans tabou', icon: 'pi pi-fw pi-palette',
                  //command: () => this.navigateTo("/libre-parole/sans-tabou")
                  routerLink:"/libre-parole/sans-tabou"
                },

              ],
              label: 'Divertissement'
            },
          ],
          [
            {
              items:[
                {
                  label: 'Allo Docteur', icon: 'pi pi-fw pi-receipt',
                  //command: () => this.navigateTo("/le-coin-sante/allo-docteur")
                  routerLink:"/le-coin-sante/allo-docteur"
                },
                {label: 'Santé', icon: 'pi pi-fw pi-mars',
                  //command: () => this.navigateTo("/actualites/sante")
                  routerLink:"/actualites/sante"
                },

              ],
              label: 'Santé & Bien-être'
            },
          ],
        ]

      },
      {
        label: 'Culture',
        icon: 'pi pi-fw pi-eye',
        styleClass: 'text-white',
        items: [
          [
            {
              items:[
                {
                  label: 'Art', icon: 'pi pi-fw pi-address-book',
                  //command: () => this.navigateTo("/culture/art")
                  routerLink:"/culture/art"
                },
                {
                  label: 'Cinéma', icon: 'pi pi-fw pi-youtube',
                  //command: () => this.navigateTo("/culture/cinema")
                  routerLink:"/culture/cinema"
                },
                {
                  label: 'Livre', icon: 'pi pi-fw pi-twitch',
                  //command: () => this.navigateTo("/culture/livres")
                  routerLink:"/culture/livres"
                },
                {
                  label: 'Musique', icon: 'pi pi-fw pi-microphone',
                  //command: () => this.navigateTo("/culture/musique")
                  routerLink:"/culture/musique"
                },

              ],
              label: 'Culture'
            },
          ],
        ]
      },
      {
        label: 'Expression Libre',
        icon: 'pi pi-fw pi-volume-down',
        styleClass: 'text-white',
        items: [
          [
            {
              items:[
                {
                  label: 'Débat', icon: 'pi pi-fw pi-address-book',
                  //command: () => this.navigateTo("/tribune/le-debat")
                  routerLink:"/tribune/le-debat"
                },
                {
                  label: 'Droit', icon: 'pi pi-fw pi-youtube',
                  //command: () => this.navigateTo("/droit/point-du-droit")
                  routerLink:"/droit/point-du-droit"
                },
                {
                  label: 'Point de vue', icon: 'pi pi-fw pi-twitch',
                  //command: () => this.navigateTo("/analyse/point-de-vue")
                  routerLink:"/analyse/point-de-vue"
                },


              ],
              label: 'Libre Voix'
            },
          ],
        ]
      },
      {
        label: 'Vidéos',
        icon: 'pi pi-fw pi-youtube',
        styleClass: 'text-white',
        items: [
          [
            {
              items:[
                {
                  label: 'Camer', icon: 'pi pi-fw pi-video',
                  //command: () => this.navigateTo("/video/Camer")
                  routerLink:"/video/Camer"
                },
                {
                  label: 'Sopie Prod', icon: 'pi pi-fw pi-youtube',
                  //command: () => this.navigateTo("/video/Sopie")
                  routerLink:"/video/Sopie"
                },



              ],
              label: 'Contenu audiovisuel'
            },
          ],
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-fw pi-briefcase',
        //command: () => this.navigateTo("/contact/contact"),
        routerLink:"/contact/contact",
        styleClass: 'text-white'

      }

   ];
  // ngOnInit(): void {

  // }
  navigateToVideo(path: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]);
    });
  }
  gotoHome() {
    this.router.navigateByUrl('/',{ skipLocationChange: true }).then(()=>{
      this.router.navigate(['/accueil']);
    })
  }
  // ngAfterViewInit(): void {
  //   this.cdr.detectChanges();
  // }
  navigateTo(path:string){
    this.router.navigate([path]);
  }
  submitSearch() {
    if (!this.isBrowser) return;

    const query = this.searchQuery();
    if (query?.trim()) {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&sitesearch=camer.be`;
      window.open(url, '_blank');
    }
    //  if (isPlatformBrowser(this.platformId)){
    //   if (this.searchQuery) {
    //     const url = `https://www.google.com/search?q=${encodeURIComponent(this.searchQuery)}&sitesearch=camer.be`;
    //     window.open(url, '_blank');
    //   }
    //  }
  }
}
