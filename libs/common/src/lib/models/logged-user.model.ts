import { UserDetail } from "./user-detail.model";

export interface LoggedUser {
  success:boolean;
  user:UserDetail;
  token: string;
  message: string;

}
