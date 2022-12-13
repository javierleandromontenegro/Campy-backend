import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Puntaje',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      puntaje: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
    }
  );
};