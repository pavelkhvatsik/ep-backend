"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const router = express_1.Router();
router.post('/registration', authController_1.default.registration);
router.post('/login', authController_1.default.login);
router.post('/refresh-tokens', authController_1.default.refreshTokens);
exports.default = router;
//# sourceMappingURL=authRouter.js.map