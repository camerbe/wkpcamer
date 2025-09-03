import { ImageDetail } from "./image-detail.model";
import { PaysDetail } from "./pays-detail.model";
import { RubriqueDetail } from "./rubrique-detail.model";
import { SousRubriqueDetail } from "./sous-rubrique-detail.model";

export interface ArticleDetail {
  idarticle: number;
  info: string;
  titre: string;
  fkpays: string;
  fkrubrique: number;
  fkuser: number;
  dateparution: Date;
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
