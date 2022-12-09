import {Sequelize } from 'sequelize';

//Es un modelo de función, la cual espera una instancia de 
//Sequelize para agregarle los modelos.
type modelTable = (sequelize: Sequelize) => void;

export default modelTable;