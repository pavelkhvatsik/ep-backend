"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../utils/env");
const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return null;
};
exports.default = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map