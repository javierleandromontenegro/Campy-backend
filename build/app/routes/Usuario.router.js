"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Usuario_service_1 = require("../services/Usuario.service");
const UsuariosRouter = (0, express_1.Router)();
//OBTENER USUARIO
UsuariosRouter.get('/:idUser', async (req, res) => {
    const { idUser } = req.params;
    try {
        res.status(200).json(await (0, Usuario_service_1.getUser)(idUser));
    }
    catch (e) {
        res.status(e.error).json(e);
    }
});
//DESHABILITAR USUARIO
UsuariosRouter.put('/deshabilitar/:idUser', async (req, res) => {
    const { idUser } = req.params;
    const { habilitar } = req.query;
    try {
        res.status(200).json(await (0, Usuario_service_1.disableUser)(idUser, +habilitar));
    }
    catch (e) {
        res.status(e.error).json(e);
    }
});
exports.default = UsuariosRouter;
