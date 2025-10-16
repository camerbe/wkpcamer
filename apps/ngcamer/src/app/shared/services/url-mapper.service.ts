import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlMapperService {
  private  byOld: Record<string, string> = {
    "1/34/31/cameroun-cameroon": "34|31",
    "/1/37/35/cameroun-cameroon":"37|35",
    "/1/12/1/cameroun-cameroon":"12|1",
    "/1/32/29/cameroun-cameroon":"32|29",
    "/1/26/23/cameroun-cameroon":"26|23",
    "/1/15/1/cameroun-cameroon":"15|1",
    "/1/35/32/cameroun-cameroon":"35|32",
    "/1/24/21/cameroun-cameroon":"24|21",
    "/1/6/1/cameroun-cameroon":"6|1",
    "1/5/1/cameroun-cameroon": "5|1",
    "1/10/1/cameroun-cameroon": "10|1",
    "1/36/33/cameroun-cameroon": "36|33",
    "1/13/1/cameroun-cameroon": "13|1",
    "1/11/1/cameroun-cameroon": "11|1",
    "1/7/1/cameroun-cameroon": "7|1",
    "1/16/6/cameroun-cameroon": "16|6",
    "1/14/6/cameroun-cameroon": "14|6",
    "1/2/6/cameroun-cameroon": "2|6",
    "1/1/6/cameroun-cameroon": "1|6",
    "1/27/25/cameroun-cameroon": "27|25",
    "1/33/30/cameroun-cameroon": "33|30",
    "1/30/27/cameroun-cameroon": "30|27",
  };

  private  byNew: Record<string, string> = {
    "actualites/people": "5|1",
    "actualites/politique": "6|1",
    "actualites/sport": "7|1",
    "actualites/religion": "10|1",
    "actualites/societe": "11|1",
    "actualites/economie": "12|1",
    "actualites/sante": "13|1",
    "actualites/insolite": "15|1",
    "actualites/serail": "39|1",
    "culture/musique": "1|6",
    "culture/livres": "2|6",
    "culture/cinema": "14|6",
    "culture/art": "16|6",
    "connexions/liens": "21|15",
    "alertes/annonces": "19|16",
    "annuaire/annuaire": "18|17",
    "contacts/contact": "17|18",
    "rendez-vous/evenements": "22|19",
    "presse/media": "24|22",
    "actu-express/jt": "23|20",
    "revue-mediatique/revue-de-presse": "25|22",
    "liens-postcoloniaux/francafrique": "26|23",
    "telecamer/camer-tv": "28|24",
    "tribune/le-debat": "27|25",
    "parcours-inspirants/success-story": "29|26",
    "analyse/point-de-vue": "30|27",
    "autrement-dit/decalage": "31|28",
    "frananglais/francaiscamer": "32|29",
    "droit/point-du-droit": "33|30",
    "camerounais-du-monde/diaspora": "34|31",
    "fait-curieux/le-saviez-vous": "35|32",
    "libre-parole/sans-tabou": "36|33",
    "le-coin-sante/allo-docteur": "37|35",
    "monde-pouvoir/geopolitique": "38|36",

  };

  public  getIds(path: string): string | null {
    const cleanPath = path.replace(/^\/+|\/+$/g, "");
    return this.byOld[cleanPath] || this.byNew[cleanPath] || null;
  }
}
