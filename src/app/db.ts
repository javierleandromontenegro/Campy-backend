import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import modelTable from './types/ModelTable';

dotenv.config();

//Crear .env con sus respectivos valores o dejar por default
//dependiendo de su database.
const { 
  DB_USER = 'root', 
  DB_PASSWORD = '1234', 
  DB_HOST = 'localhost', 
  DB_NAME = 'campy_db'
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, 
  {
    host: DB_HOST,
    dialect: 'mysql',
  });

const basename = path.basename(__filename);

const modelDefiners: modelTable[] = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file: string): boolean =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
  )
  .forEach((file: string) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)).default);
  });
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model: modelTable): void => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);

const { Usuarios, Tipo_usuarios } = sequelize.models;

Usuarios.hasOne(Tipo_usuarios);
Tipo_usuarios.belongsTo(Usuarios);

const models = Object.fromEntries(capsEntries);

export default  {
  ...models,
  conn: sequelize,
};