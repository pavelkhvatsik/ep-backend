import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { IMiddlewareRequest } from '../interfaces/middleware.interfaces';
import { IUser } from '../interfaces/user.interfaces';
import ApiError from '../error/ApiError';

const authMiddleware = (
  req: IMiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Unauthorized'));
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as IUser;
    req.user = decoded;
    next();
  } catch (e) {
    return next(ApiError.unauthorized('Unauthorized'));
  }
  return null;
};

export default authMiddleware;
