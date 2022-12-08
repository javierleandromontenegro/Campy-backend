import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Reviews',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comentario: {
        type: DataTypes.TEXT
      },
      fecha: {
        type: DataTypes.DATE
      }
    }
  );
};