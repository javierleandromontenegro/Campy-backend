"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Provincias_service_1 = require("../services/Provincias.service");
const ProvinciaRouter = (0, express_1.Router)();
ProvinciaRouter.get('/:idPais', async (req, res) => {
    const { idPais } = req.params;
    try {
        res.status(200).json(await (0, Provincias_service_1.getProvincias)(idPais));
    }
    catch (_a) {
        res.status(404).json({ error: 'no se pudo en http://localhost/api/provincias' });
    }
});
exports.default = ProvinciaRouter;
