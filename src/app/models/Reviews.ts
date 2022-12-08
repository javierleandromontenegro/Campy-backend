import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Reviews',
    {
      comentario: {
        type: DataTypes.TEXT
      },
      fecha: {
        type: DataTypes.DATE
      }
    }
  );
};