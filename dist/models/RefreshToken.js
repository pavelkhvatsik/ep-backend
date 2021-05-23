"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const RefreshToken = db_1.default.define('refresh_token', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    token: { type: sequelize_1.DataTypes.UUID, unique: true, allowNull: false },
    expiresIn: { type: sequelize_1.DataTypes.DATE, allowNull: false },
});
exports.default = RefreshToken;
//# sourceMappingURL=RefreshToken.js.map