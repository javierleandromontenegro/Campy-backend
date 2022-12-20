"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { sequelize } = require('../db');
const ConfirmUserRouter = (0, express_1.Router)();
ConfirmUserRouter.get('/:token', async (req, res) => {
    const { token } = req.params;
    const id = String(req.query.id);
    try {
        jsonwebtoken_1.default.verify(token, String(process.env.SECRET), (err, result) => {
            if (err)
                throw err;
            const { id } = result;
            sequelize.query(`UPDATE Usuarios SET habilitado=1 WHERE id=${id};`).then(() => res.status(200).send(getTemplateConfirm(true)));
        });
    }
    catch (e) {
        const { expiredAt } = e;
        if (expiredAt)
            await sequelize.query(`DELETE FROM Usuarios WHERE id=${id} AND habilitado=0;`);
        res.status(406).send(getTemplateConfirm(false));
    }
});
function getTemplateConfirm(success) {
    return `<head>
      <style>
        body {
          margin: 0;
        }

        div {
          width: 100vw; 
          height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          background-color: #285430;
        }

        h2 {
          font-family: sans-serif;
          font-size: 3.25rem;
          text-shadow: 0 3px rgb(30, 30, 30);
          opacity: 0;
          transform: scale(0);
          animation: aparecer .6s ease forwards;
        }

        @keyframes aparecer {
          100% {
            opacity: 100%;
            transform: scale(1);
          }
        }
      </style>
    </head>
    <div>
      <h2 style='color:${success ? '#E5D9B6' : '#F5333E'};'>${success ? '¡Confirmación exitosa!' : 'Error de verificación'}</h2>
    </div>`;
}
exports.default = ConfirmUserRouter;
