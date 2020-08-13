"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route = express_1.Router();
exports.default = (app) => {
    app.use(route);
    route.post('/auth', async (req, res, next) => {
        try {
            console.log('[auth]', req.body);
            return res.status(201);
        }
        catch (err) {
            console.log(err);
            return next(err);
        }
    });
};
//# sourceMappingURL=auth.js.map