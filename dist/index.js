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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./utils/env");
const ErrorHandlerMiddleware_1 = __importDefault(require("./middleware/ErrorHandlerMiddleware"));
const index_1 = __importDefault(require("./routes/index"));
const index_2 = __importDefault(require("./db/index"));
const PORT = process.env.PORT || 5000;
const app = express_1.default();
app.use(cors_1.default());
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use('/api', index_1.default);
app.use(ErrorHandlerMiddleware_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_2.default.authenticate();
        yield index_2.default.sync();
        app.listen(PORT, () => {
            console.log(`Example app listening at http://localhost:${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
start();
//# sourceMappingURL=index.js.map