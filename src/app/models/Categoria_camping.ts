import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Categoria_camping',
    {
      categoria: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cantidad_estrellas: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      descripcion_categoria: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }
  );
};