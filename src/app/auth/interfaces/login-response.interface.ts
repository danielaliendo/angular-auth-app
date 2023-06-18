import { User } from "./user.interface";

export interface LoginResponse extends User {
  token:    string;
}
