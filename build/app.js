"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
(async () => {
    const app = express_1.default();
    await require('./loaders').default({ expressApp: app });
    app.listen(config_1.default.port, (err) => {
        if (err) {
            console.log(err);
            process.exit(1);
            return;
        }
    });
})();
//# sourceMappingURL=app.js.map