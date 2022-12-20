"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const { conn } = require('./app/db');
const PORT = process.env.PORT || 3001;
// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
    app_1.default.listen(PORT, () => {
        console.log("server listening at 3001");
    });
});
