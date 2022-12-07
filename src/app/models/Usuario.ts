import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'usuarios',
    {
      nombre: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
    }
    )
}