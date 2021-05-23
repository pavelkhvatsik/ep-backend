import { Request } from 'express';
import { IUser } from './user.interfaces';

export interface IMiddlewareRequest extends Request {
  user?: IUser;
}
