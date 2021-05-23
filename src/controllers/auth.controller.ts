import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { IParamsJwt } from '../interfaces/auth.interfaces';
import { generateExpiresInRefreshToken } from '../helpers/auth.helpers';
import { RefreshToken, User } from '../models';
import ApiError from '../error/ApiError';

const generateJwt = async (res: Response, params: IParamsJwt) => {
  const newRefreshToken = uuidv4();
  const expiresInRefreshToken = generateExpiresInRefreshToken();

  await RefreshToken.create({
    token: newRefreshToken,
    userId: params.id,
    expiresIn: expiresInRefreshToken,
  });

  res.cookie('refreshToken', newRefreshToken, {
    path: 'auth/',
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    httpOnly: true,
  });

  return jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    const { email, password, roleId, username } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Incorrect email or password'));
    }

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(ApiError.badRequest('User with this email already exists'));
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      roleId,
      email,
      username,
      password: hashPassword,
    });
    const token = await generateJwt(res, {
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({ token });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(ApiError.badRequest('User not found'));
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(ApiError.badRequest('Incorrect password'));
    }

    const token = await generateJwt(res, {
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({ token });
  }

  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    const { refreshToken: receivedRefreshToken } = req.cookies;
    const dbToken = await RefreshToken.findOne({
      where: { token: receivedRefreshToken },
    });

    if (!dbToken) {
      return next(ApiError.unauthorized('Token in not exists'));
    }
    if (dbToken.expiresIn < new Date()) {
      return next(ApiError.unauthorized('Token expired'));
    }

    await RefreshToken.destroy({ where: { token: receivedRefreshToken } });

    const user = await User.findOne({ where: { id: dbToken.userId } });
    const token = await generateJwt(res, {
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return res.json({ token });
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    await RefreshToken.destroy({ where: { token: refreshToken } });

    res.clearCookie('refreshToken', { path: 'auth/' });

    return res.end();
  }
}

export default new AuthController();
