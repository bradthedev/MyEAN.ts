import { Request } from 'express';
import {Account} from 'interfaces/index.interface';
 
export interface RequestWithUser extends Request {
  account: Account;
}