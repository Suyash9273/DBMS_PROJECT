import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Create a new Sequelize instance to connect to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,    //Database name
  process.env.DB_USER,    //Database username
  process.env.DB_PASSWORD,    //Database password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // THIS IS THE IMPORTANT PART
    logging: false

    // (sql) => {
    //   console.log("SQL >>>", sql); // This will log the raw SQL query
    // }
  }
);

// Function to test database connection:-> 

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
};

export default sequelize;