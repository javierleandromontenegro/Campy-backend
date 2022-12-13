"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckoutUser_service_1 = require("../services/CheckoutUser.service");
const Localidades_service_1 = require("../services/Localidades.service");
const LocalidadesRouter = (0, express_1.Router)();
LocalidadesRouter.get('/:idProvincia', async (req, res) => {
    const { idProvincia } = req.params;
    try {
        res.status(200).json(await (0, Localidades_service_1.getLocalidades)(idProvincia));
    }
    catch (_a) {
        res.status(404).json({ error: 'no se pudo en http://localhost/api/localidades' });
    }
});
LocalidadesRouter.post('/', CheckoutUser_service_1.checkoutUser, CheckoutUser_service_1.checkoutAdmin, async (req, res) => {
    try {
        res.status(200).json(await (0, Localidades_service_1.postLocalidades)(req.body));
    }
    catch (error) {
        res.status(error.error).json(error);
    }
});
exports.default = LocalidadesRouter;
