import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Posts_comentario',
    {
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false
      },
    }
  );
};