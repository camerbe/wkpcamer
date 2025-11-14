import { PubDimensionDetail } from "./pub-dimension-detail.model";
import { TypePubDetail } from "./type-pub-detail.model";

export interface PubDetail {
  id:number;
  endpubdate: Date;
  fkdimension: number;
  fktype: number;
  pub:string;
  href:string;
  imagewidth:number;
  imageheight:number;
  editor:string;
  image_url:string;
  dimensions:PubDimensionDetail;
  typepubs:TypePubDetail;
}
