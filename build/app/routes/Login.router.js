"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Login_service_1 = require("../services/Login.service");
const LoginRouter = (0, express_1.Router)();
LoginRouter.post('/', async (req, res) => {
    try {
        res.status(200).json(await (0, Login_service_1.loginUser)(req.body));
    }
    catch (e) {
        res.status(e.error).json(e);
    }
});
exports.default = LoginRouter;
