import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Route = sequelize.define(
    'Route',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Foreign keys for train and station will be added in the associations step
        arrival_time: {
            type: DataTypes.TIME
        },
        departure_time: {
            type: DataTypes.TIME
        },
        stop_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Order of stop ex: 1 for source, 2 for next, ...'
        }
    },

    {
        tableName: 'routes',
        timestamps: true,
    }
);

export default Route;