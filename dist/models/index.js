"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const RefreshToken_1 = __importDefault(require("./RefreshToken"));
exports.RefreshToken = RefreshToken_1.default;
RefreshToken_1.default.belongsTo(User_1.default);
//# sourceMappingURL=index.js.map