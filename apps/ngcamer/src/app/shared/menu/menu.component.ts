import { ButtonModule } from 'primeng/button';
import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from "primeng/megamenu";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterLink, RouterModule } from '@angular/router';

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
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit,AfterViewInit {



  items: MegaMenuItem[] | undefined;
  searchTerm = '';

  router=inject(Router);
  cdr=inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-fw pi-home',
        styleClass: 'text-green-800 font-bold',
        items: [
          [
            {
              items:[
                {label: 'Diaspora', icon: 'pi pi-fw pi-users',
                  command: () => this.navigateTo("/camerounais-du-monde/diaspora")
                },
                {label: 'Économie', icon: 'pi pi-fw pi-dollar',
                  command: () => this.navigateTo("/actualites/economie")
                },
                {label: 'Religion', icon: 'pi pi-fw pi-crown',command: () => this.navigateTo("/actualites/religion")},
                {label: 'Société', icon: 'pi pi-fw pi-bullseye',command: () => this.navigateTo("/actualites/societe")},
                {label: 'Politique', icon: 'pi pi-fw pi-list',command: () => this.navigateTo("/actualites/politique")},
              ],
              label: 'Actualité & Société'
            },
          ],
          [
            {
              items:[
                {label: 'FrançaisCamer', icon: 'pi pi-fw pi-ethereum',command: () => this.navigateTo("/frananglais/francaiscamer")},
                {label: 'Françafrique', icon: 'pi pi-globe pi-prime',command: () => this.navigateTo("/liens-postcoloniaux/francafrique")},

                {label: 'Géopolitique', icon: 'pi pi-fw pi-prime',command: () => this.navigateTo("/monde-pouvoir/geopolitique")},

              ],
              label: 'International'
            },
          ],
          [
            {
              items:[
                {label: 'Insolite', icon: 'pi pi-fw pi-verified',command: () => this.navigateTo("/actualites/insolite")},
                {label: 'Le saviez-vous', icon: 'pi pi-fw pi-bolt',command: () => this.navigateTo("/fait-curieux/le-saviez-vous")},
                {label: 'People', icon: 'pi pi-fw pi-users',command: () => this.navigateTo("/actualites/people")},
                {label: 'Sans tabou', icon: 'pi pi-fw pi-palette',command: () => this.navigateTo("/libre-parole/sans-tabou")},

              ],
              label: 'Divertissement'
            },
          ],
          [
            {
              items:[
                {label: 'Allo Docteur', icon: 'pi pi-fw pi-receipt',command: () => this.navigateTo("/le-coin-sante/allo-docteur")},
                {label: 'Santé', icon: 'pi pi-fw pi-mars',command: () => this.navigateTo("/actualites/sante")},

              ],
              label: 'Santé & Bien-être'
            },
          ],
        ]

      },
      {
        label: 'Culture',
        icon: 'pi pi-fw pi-eye',
        styleClass: 'text-green-800 font-bold',
        items: [
          [
            {
              items:[
                {label: 'Art', icon: 'pi pi-fw pi-address-book',command: () => this.navigateTo("/culture/art")},
                {label: 'Cinéma', icon: 'pi pi-fw pi-youtube',command: () => this.navigateTo("/culture/cinema")},
                {label: 'Livre', icon: 'pi pi-fw pi-twitch',command: () => this.navigateTo("/culture/livres")},
                {label: 'Musique', icon: 'pi pi-fw pi-microphone',command: () => this.navigateTo("/culture/musique")},

              ],
              label: 'Culture'
            },
          ],
        ]
      },
      {
        label: 'Expression Libre',
        icon: 'pi pi-fw pi-volume-down',
        styleClass: 'text-green-800; font-bold',
        items: [
          [
            {
              items:[
                {label: 'Débat', icon: 'pi pi-fw pi-address-book',command: () => this.navigateTo("/tribune/le-debat")},
                {label: 'Droit', icon: 'pi pi-fw pi-youtube',command: () => this.navigateTo("/droit/point-du-droit")},
                {label: 'Point de vue', icon: 'pi pi-fw pi-twitch',command: () => this.navigateTo("/analyse/point-de-vue")},


              ],
              label: 'Libre Voix'
            },
          ],
        ]
      },
      {
        label: 'Vidéos',
        icon: 'pi pi-fw pi-youtube',
        styleClass: 'text-green-800; font-bold',
        items: [
          [
            {
              items:[
                {label: 'Camer', icon: 'pi pi-fw pi-video',command: () => this.navigateTo("/video/Camer")},
                {label: 'Sopie Prod', icon: 'pi pi-fw pi-youtube',command: () => this.navigateTo("/video/Sopie")},



              ],
              label: 'Contenu audiovisuel'
            },
          ],
        ]
      },
      {
        label: 'Contact',
        icon: 'pi pi-fw pi-briefcase',
        styleClass: 'text-green-800; font-bold'

      }

    ]
  }
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
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  navigateTo(path:string){
    this.router.navigate([path]);
  }
}
