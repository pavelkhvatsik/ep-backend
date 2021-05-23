import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { IMiddlewareRequest } from '../interfaces/middleware.interfaces';
import { IUser } from '../interfaces/user.interfaces';
import { ERole } from '../enums/user.enums';
import ApiError from '../error/ApiError';

const checkRoleMiddleware = (role: ERole) => (
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
    if (decoded.role !== role) {
      return next(ApiError.forbidden('Forbidden'));
    }
    req.user = decoded;
    next();
  } catch (e) {
    return next(ApiError.unauthorized('Unauthorized'));
  }
  return null;
};

export default checkRoleMiddleware;
