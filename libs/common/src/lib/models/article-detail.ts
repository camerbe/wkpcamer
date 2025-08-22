import { ImageDetail } from "./image-detail";
import { PaysDetail } from "./pays-detail";
import { RubriqueDetail } from "./rubrique-detail";
import { SousRubriqueDetail } from "./sous-rubrique-detail";

export interface ArticleDetail {
  idarticle: number;
  info: string;
  titre: string;
  fkpays: string;
  fkrubrique: number;
  fkuser: number;
  dateparution: string;
  hit: number;
  fksousrubrique: number;
  auteur: string;
  source: string;
  keyword: string;
  image: string[];
  slug: string;
  chapeau: string;
  countries: PaysDetail;
  rubrique: RubriqueDetail;
  sousrubrique: SousRubriqueDetail;
  images: ImageDetail;
}
