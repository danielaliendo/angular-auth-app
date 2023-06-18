import { User } from "./user.interface";

export interface VerifyTokenResponse extends User {
  token:    string;
}
