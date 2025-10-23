import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Train = sequelize.define(
    'Train',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        train_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        train_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        total_seats_sleeper: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        total_seats_ac: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    },

    {
        tableName: 'trains',
        timestamps: true,
    }
);

export default Train;