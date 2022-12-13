"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Campings_router_1 = __importDefault(require("./Campings.router"));
const Paises_router_1 = __importDefault(require("./Paises.router"));
const Provincia_route_1 = __importDefault(require("./Provincia.route"));
const Localidades_router_1 = __importDefault(require("./Localidades.router"));
const Register_router_1 = __importDefault(require("./Register.router"));
const Login_router_1 = __importDefault(require("./Login.router"));
const Usuario_router_1 = __importDefault(require("./Usuario.router"));
const ConfirmUser_router_1 = __importDefault(require("./ConfirmUser.router"));
// Importar todos los routers;
const router = (0, express_1.Router)();
// 'http://localhost/api/provincias'
router.use('/paises', Paises_router_1.default);
router.use('/provincias', Provincia_route_1.default);
router.use('/localidades', Localidades_router_1.default);
router.use('/campings', Campings_router_1.default);
router.use('/register', Register_router_1.default);
router.use('/login', Login_router_1.default);
router.use('/usuarios', Usuario_router_1.default);
router.use('/confirm', ConfirmUser_router_1.default);
// Configurar los routers
exports.default = router;
