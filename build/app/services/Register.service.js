"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const nodemailer_1 = __importDefault(require("nodemailer"));
const { sequelize, Usuarios } = require('../db');
const registerUser = async ({ email, clave, nombre_completo, numero_celular, direccion, dni, tipo }) => {
    if (!email || !clave || !nombre_completo || !numero_celular || !direccion || !dni || !tipo)
        throw {
            error: 406, message: 'Faltan parámetros necesarios'
        };
    if (tipo !== 2 && tipo !== 3)
        throw {
            error: 406, message: 'Tipo de usuario incorrecto'
        };
    const findUser = await Usuarios.findOne({ where: { email } });
    if (findUser)
        throw {
            error: 406, message: 'Ese correo ya se encuentra registrado'
        };
    const [userRegisteredId] = await sequelize.query(`INSERT INTO Usuarios (email, clave, nombre_completo, numero_celular, direccion, dni, TipoUsuarioId, createdAt, updatedAt) VALUES ('${email}', '${await (0, bcrypt_1.hash)(clave, 8)}', '${nombre_completo}', '${numero_celular}', '${direccion}', '${dni}', ${tipo}, NOW(), NOW())`);
    const [[createdUser]] = await sequelize.query(`SELECT id, email, clave, nombre_completo, numero_celular, direccion, dni, TipoUsuarioId AS tipo FROM Usuarios WHERE id=${userRegisteredId};`);
    console.log(createdUser);
    const token = getToken(createdUser);
    const templateHtml = getTemplateHtml(createdUser.nombre_completo, token, Number(createdUser.id));
    await sendEmail({ userEmail: createdUser.email, subject: 'Confirmá tu cuenta de google', templateHtml });
    return createdUser;
};
exports.registerUser = registerUser;
function getTemplateHtml(name, token, id) {
    return (`
      <head>
        <style>
          #message-container {
            width: 100%;
            min-height: 100px;
            text-align: center;
            justify-content: center;
            align-items: center;
            padding: 30px 0;
            background-color: #5F8D4E;
          }

          #greeting {
            color: white;
            font-size: 30px;
            padding: 0;
            margin: 0;
          }

          #description {
            color: white;
            font-size: 20px;
            padding: 0;
            margin: 15px 0;
          }

          #warning {
            width: 80%;
            color: white;
            font-size: 15px;
            font-style: italic;
            padding: 0;
            margin: 15px auto;
          }

          #confirm-link {
            color: #45433F;
            font-size: 15px;
            font-weight: 600;
            padding: 8px 5px;
            cursor: pointer;
            text-decoration: none;
            border-radius: 5px;
            transition: all 0.5s ease;
            background-color: #E5D9B6;
          }

          #confirm-link:hover {
            color: white;
            background-color: #BDB395;
          }
        </style>
      </head>
      <div id='message-container'>
          <img style='height: 30px; width: auto' src='https://res.cloudinary.com/pfcampy/image/upload/v1670466096/logo_CAMPY_rjsp9a.png' alt='logo-campy' />
          <h2 id='greeting'>¡Felicidades ${name}!</h2>
          <p id='description'>Estás a un solo paso de ser un nuevo Campy...</p>
          <p id='warning'>(Si han pasado más de 12hs desde el registro es probable que al apretar el botón 'verificar cuenta' dé un error. Si es así, volvé a registrarte en la página para obtener un nuevo correo de confirmación)</p>
          <a id='confirm-link' href='${process.env.HOST}/api/confirm/${token}?id=${id}' target='_blank'>
            Verificar cuenta
          </a>
      </div>
    `);
}
;
function getToken(data) {
    return jsonwebtoken_1.default.sign(data, String(process.env.SECRET), { expiresIn: "12hs" });
}
async function sendEmail({ userEmail, subject, templateHtml }) {
    try {
        const { EMAIL, EMAIL_PASSWORD } = process.env;
        console.log(EMAIL, EMAIL_PASSWORD, userEmail);
        let transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD
            },
        });
        await transporter.sendMail({
            from: `"Campy" <${EMAIL}>`,
            to: userEmail,
            subject,
            text: "Confirmar cuenta de google",
            html: templateHtml,
        });
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}
