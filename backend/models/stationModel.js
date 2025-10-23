import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Station = sequelize.define(
    "Station", // Name the model
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        station_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        station_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // ex: NDLS for new delhi
        }
    },

    {
        tableName: 'stations',
        timestamps: true, // You can set this to false if you don't need to track when stations are added/updated
    }
);

export default Station;