import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from "primeng/megamenu";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MegaMenu,
    InputTextModule,
    FormsModule,
    InputGroupModule,
    ButtonModule,
    InputGroupAddonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  items: MegaMenuItem[] | undefined;
  searchTerm = '';
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
                {label: 'Diaspora', icon: 'pi pi-fw pi-users'},
                {label: 'Économie', icon: 'pi pi-fw pi-dollar'},
                {label: 'Religion', icon: 'pi pi-fw pi-crown'},
                {label: 'Société', icon: 'pi pi-fw pi-bullseye'},
                {label: 'Politique', icon: 'pi pi-fw pi-list'},
              ],
              label: 'Actualité & Société'
            },
          ],
          [
            {
              items:[
                {label: 'FrançaisCamer', icon: 'pi pi-fw pi-ethereum'},
                {label: 'Françafrique', icon: 'pi pi-fw pi-prime'},

              ],
              label: 'International'
            },
          ],
          [
            {
              items:[
                {label: 'Insolite', icon: 'pi pi-fw pi-verified'},
                {label: 'Le saviez-vous', icon: 'pi pi-fw pi-bolt'},
                {label: 'People', icon: 'pi pi-fw pi-users'},
                {label: 'Sans tabou', icon: 'pi pi-fw pi-palette'},

              ],
              label: 'Divertissement'
            },
          ],
          [
            {
              items:[
                {label: 'Allo Docteur', icon: 'pi pi-fw pi-receipt'},
                {label: 'Santé', icon: 'pi pi-fw pi-mars'},

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
                {label: 'Art', icon: 'pi pi-fw pi-address-book'},
                {label: 'Cinéma', icon: 'pi pi-fw pi-youtube'},
                {label: 'Livre', icon: 'pi pi-fw pi-twitch'},
                {label: 'Musique', icon: 'pi pi-fw pi-microphone'},

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
                {label: 'Débat', icon: 'pi pi-fw pi-address-book'},
                {label: 'Droit', icon: 'pi pi-fw pi-youtube'},
                {label: 'Point de vue', icon: 'pi pi-fw pi-twitch'},


              ],
              label: 'Libre Voix'
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
}
