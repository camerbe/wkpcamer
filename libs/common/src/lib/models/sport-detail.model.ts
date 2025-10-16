
export interface SportDetail {

  id:number;
  hit:number;
  titre:string;
  slug:string;
  auteur:string;
  source:string;
  motclef:string;
  chapeau:string;
  article:string;
  image:string;
  date_parution:Date;
  pays_code:string;
  categorie_id:number;
  competition_id:number;
  user:UserSportDetails;
  pays:PaysSportDetail;
  images: ImageSportDetail;
  categorie: CategorieDetail;
  competition: CompetitionDetail;



}
export interface Meta{
  width:number;
  height:number;
}
export interface ImageSportDetail {
  url:string;
  mime_type:string;
  extension:string;
  width:string;
  height:string;
}

export interface UserSportDetails {
  id:number;
  nom:string;
  email:string;
  password:string;
  role:string;
  prenom:string;
  fullName:string;
  email_verified_at:boolean;
  password_changed_at:boolean;
}
export interface PaysSportDetail {
  code:string;
  pays:string;
  country:string;
  code3:string;
}
export interface CategorieDetail {
  id:number;
  categorie:string;
  slugcategorie:string;
  competitions:CompetitionDetail[];
}
export interface CompetitionDetail {
  id:number;
  competition:string;
  slugcompetition :string;
}


