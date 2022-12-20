"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Register_service_1 = require("../services/Register.service");
const RegisterRouter = (0, express_1.Router)();
RegisterRouter.post('/', async (req, res) => {
    try {
        res.status(201).json(await (0, Register_service_1.registerUser)(req.body));
    }
    catch (e) {
        console.log("error", e);
        res.status(400).json(e);
    }
});
exports.default = RegisterRouter;
