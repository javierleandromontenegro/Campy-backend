"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Campings_service_1 = require("../services/Campings.service");
const CampingsRouter = (0, express_1.Router)();
CampingsRouter.get('/provincias/:idProvincia', async (req, res) => {
    const { idProvincia } = req.params;
    try {
        res.status(200).json(await (0, Campings_service_1.getCampingsPorProvincia)(idProvincia));
    }
    catch (_a) {
        res.status(404).json({ error: `no se pudo en http://localhost/api/campings/sprovincias/${idProvincia}` });
    }
});
CampingsRouter.get('/localidades/:idLocalidad', async (req, res) => {
    const { idLocalidad } = req.params;
    try {
        res.status(200).json(await (0, Campings_service_1.getCampingsPorLocalidad)(idLocalidad));
    }
    catch (_a) {
        res.status(404).json({ error: `no se pudo en http://localhost/api/localidades/${idLocalidad}` });
    }
});
CampingsRouter.get('/:idCamping', async (req, res) => {
    const { idCamping } = req.params;
    try {
        res.status(200).json(await (0, Campings_service_1.getCampingsPorId)(idCamping));
    }
    catch (_a) {
        res.status(404).json({ error: `no se pudo en http://localhost/api/camping/${idCamping}` });
    }
});
//TODOS LOS CAMPING CON DETALLE E IMAGENES
CampingsRouter.get('/', async (_req, res) => {
    try {
        res.status(200).json(await (0, Campings_service_1.getCampingsTodos)());
    }
    catch (_a) {
        res.status(404).json({ error: `no se pudo en http://localhost/api/camping` });
    }
});
CampingsRouter.get('/imagenes/:idCamping', async (req, res) => {
    const { idCamping } = req.params;
    try {
        res.status(200).json(await (0, Campings_service_1.getCampingsImagenes)(idCamping));
    }
    catch (_a) {
        res.status(404).json({ error: `no se pudo en http://localhost/api/camping/imagenes/${idCamping}` });
    }
});
CampingsRouter.post('/', async (req, res) => {
    try {
        res.status(200).json(await (0, Campings_service_1.postCampingsCreate)(req.body));
    }
    catch (error) {
        res.status(error.error).json(error);
    }
});
exports.default = CampingsRouter;
