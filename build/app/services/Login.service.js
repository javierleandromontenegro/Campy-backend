"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const CheckoutUser_service_1 = require("./CheckoutUser.service");
const loginUser = async ({ email, clave }) => {
    if (!email || !clave)
        throw { error: 406, message: 'Faltan parámetros' };
    const { nombre_completo, id, dni, numero_celular, direccion, tipo } = await (0, CheckoutUser_service_1.searchUser)(email, clave);
    const token = (0, jsonwebtoken_1.sign)({
        email,
        clave
    }, String(process.env.SECRET));
    return {
        id,
        nombre_completo,
        email,
        numero_celular,
        dni,
        direccion,
        tipo,
        token
    };
};
exports.loginUser = loginUser;
