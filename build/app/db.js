"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const modelRelations_1 = __importDefault(require("./modelRelations"));
dotenv_1.default.config();
//Crear .env con sus respectivos valores o dejar por default
//dependiendo de su database.
const { DB_USER = 'root', DB_PASSWORD = '1234', DB_HOST = 'localhost', DB_NAME = 'campy_db' } = process.env;
const sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});
const basename = path_1.default.basename(__filename);
const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs_1.default.readdirSync(path_1.default.join(__dirname, "/models"))
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && (file.slice(-3) === ".ts" || file.slice(-3) === ".js"))
    .forEach((file) => {
    modelDefiners.push(require(path_1.default.join(__dirname, "/models", file)).default);
});
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
(0, modelRelations_1.default)(sequelize.models);
module.exports = {
    sequelize,
    ...sequelize.models,
    conn: sequelize,
};
