import { Request, Response, NextFunction } from 'express';
import { Role } from '../models';
import ApiError from '../error/ApiError';

class RoleController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;

    if (!name) {
      return next(ApiError.badRequest('"name" shouldn\'t be empty'));
    }

    const role = await Role.findOne({ where: { name } });

    if (role) {
      return next(ApiError.badRequest('Role already exists'));
    }

    const createdRole = await Role.create({ name });

    return res.json({ role: createdRole });
  }
}

export default new RoleController();
