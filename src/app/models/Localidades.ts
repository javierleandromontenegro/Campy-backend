import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
  sequelize.define(
    'Localidades',
    {
      nombre: {
        type: DataTypes.STRING
      },
      imagen: {
        type: DataTypes.STRING
      },
      descrip_historia:{
        type: DataTypes.STRING
      },
      latitud:{
        type: DataTypes.STRING
      },
      longitud:{
        type: DataTypes.STRING
      }
    }
  );
};