import { IRepository } from "./irepository.model";
import { UserDetail } from "./user-detail.model";

export interface LoggedUser extends IRepository<UserDetail> {
  token: string;
}
