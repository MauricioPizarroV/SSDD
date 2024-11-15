import { DataTypes } from 'sequelize'
import db from '../config/db.js'
const Equipo = db.define('equipos',{

    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    modelo:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    observaciones:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    serial:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    AF:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    ubicacion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: { 
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

export default Equipo;