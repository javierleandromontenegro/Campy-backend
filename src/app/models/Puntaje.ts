import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Puntaje',
    {
      puntaje: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
    }
  );
};