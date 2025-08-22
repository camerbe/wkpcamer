import { IRepository } from "./irepository";
import { UserDetail } from "./user-detail";

export interface LoggedUser extends IRepository<UserDetail> {
  token: string;
}
