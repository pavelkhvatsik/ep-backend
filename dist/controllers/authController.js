"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
require("../utils/env");
const ApiError_1 = __importDefault(require("../error/ApiError"));
const models_1 = require("../models");
/*
TODO:
+ 1) Split to auth and user models
+ 2) Add expire time to refresh token
3) Add checking expire time to middleware
4) Add fingerprint to refresh token model
5) Add logout method and clearing refresh token table
6) Interfaces
+ 7) Refresh token to cookies
+ 7) Refact code, check code style
*/
const generateJwt = (id, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const newRefreshToken = uuid_1.v4();
    const now = new Date();
    const expiresInRefreshToken = new Date(now.getDate() + 2592000000);
    yield models_1.RefreshToken.create({
        token: newRefreshToken,
        userId: id,
        expiresIn: expiresInRefreshToken,
    });
    return {
        token: jsonwebtoken_1.default.sign({ id, email, role }, process.env.SECRET_KEY, {
            expiresIn: '5m',
        }),
        refreshToken: newRefreshToken,
    };
});
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return next(ApiError_1.default.badRequest('Incorrect email or password'));
            }
            const candidate = yield models_1.User.findOne({ where: { email } });
            if (candidate) {
                return next(ApiError_1.default.badRequest('User with this email already exists'));
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 5);
            const user = yield models_1.User.create({
                email,
                role,
                password: hashPassword,
            });
            const { token, refreshToken } = yield generateJwt(user.id, user.email, user.role);
            res.cookie('refreshToken', refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });
            return res.json({ token });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield models_1.User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError_1.default.badRequest('User not found'));
            }
            const comparePassword = bcrypt_1.default.compareSync(password, user.password);
            if (!comparePassword) {
                return next(ApiError_1.default.badRequest('Incorrect password'));
            }
            const { token, refreshToken } = yield generateJwt(user.id, user.email, user.role);
            res.cookie('refreshToken', refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });
            return res.json({ token });
        });
    }
    refreshTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken: receivedRefreshToken } = req.cookies;
            const dbToken = yield models_1.RefreshToken.findOne({
                where: {
                    token: receivedRefreshToken,
                },
            });
            console.log(dbToken);
            if (!dbToken) {
                return next(ApiError_1.default.unauthorized('Token in not exists'));
            }
            yield models_1.RefreshToken.destroy({
                where: {
                    token: receivedRefreshToken,
                },
            });
            const user = yield models_1.User.findOne({
                where: { id: dbToken.dataValues.userId },
            });
            const { token, refreshToken } = yield generateJwt(user.id, user.email, user.role);
            res.cookie('refreshToken', refreshToken, {
                maxAge: 2592000000,
                httpOnly: true,
            });
            return res.json({ token });
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=authController.js.map