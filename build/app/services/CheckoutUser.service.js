"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutAdmin = exports.checkoutOwner = exports.checkoutUser = exports.searchUser = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const { sequelize } = require('../db');
const searchUser = async (email, clave) => {
    const [[findUser]] = await sequelize.query(`SELECT id, email, clave, nombre_completo, numero_celular, direccion, dni, habilitado, TipoUsuarioId AS tipo FROM Usuarios WHERE email='${email}';`);
    const verifyPassword = findUser && await (0, bcrypt_1.compare)(clave, findUser.clave);
    if (!findUser || !verifyPassword)
        throw { error: 401, message: 'Usuario Inválido' };
    if (!findUser.habilitado)
        throw { error: 401, message: 'Cuenta deshabilitada' };
    return findUser;
};
exports.searchUser = searchUser;
const checkoutUser = async (req, res, next) => {
    try {
        const { token } = req.body;
        let result = (0, jsonwebtoken_1.verify)(token, String(process.env.SECRET));
        const { email, clave } = result;
        const findUser = await (0, exports.searchUser)(email, clave);
        if (!findUser)
            throw {};
        req.body.user = findUser;
        next();
    }
    catch (_a) {
        res.status(401).json({ error: 401, message: 'Autorización denegada' });
    }
};
exports.checkoutUser = checkoutUser;
const checkoutOwner = (req, res, next) => {
    const tipo = Number(req.body.user.tipo);
    if (tipo !== 2)
        return res.status(401).json({ error: 401, message: 'Autorización denegada' });
    next();
};
exports.checkoutOwner = checkoutOwner;
const checkoutAdmin = (req, res, next) => {
    const tipo = Number(req.body.user.tipo);
    if (tipo !== 1)
        return res.status(401).json({ error: 401, message: 'Autorización denegada' });
    next();
};
exports.checkoutAdmin = checkoutAdmin;
