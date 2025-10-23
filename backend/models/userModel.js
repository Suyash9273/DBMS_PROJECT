import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

//Defining the user model which represents the user table in the database
const User = sequelize.define(
    'User', //Name of the model
    {
        //Model attributes are defined here: ->
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            comment: 'Unique identifier for the user'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false, // name cannot be null
            comment: 'Name of the user'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // email must be unique
            validate: {
                isEmail: true, // ensures that the value is a valid email format
            },
            comment: 'Email address of the user for login'
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Hashed password for the user'
        }
    },
    {
        //other model options go here
        tableName: 'users', //Explicityly set the table name
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

export default User;
