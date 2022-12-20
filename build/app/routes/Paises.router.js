"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Paises_service_1 = require("../services/Paises.service");
const PaisRouter = (0, express_1.Router)();
PaisRouter.get('/', async (_req, res) => {
    try {
        res.status(200).json(await (0, Paises_service_1.getPaises)());
    }
    catch (_a) {
        res.status(404).json({ error: 'no se pudo en http://localhost/api/paises' });
    }
});
exports.default = PaisRouter;
