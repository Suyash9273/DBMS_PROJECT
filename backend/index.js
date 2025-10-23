// Use import syntax for all packages
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Automatically load .env
import sequelize from './config/db.js';
import userRoutes from './routes/userRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares : -> 
// app.use(cors());
app.use(express.json());

// Api routes : -> 
app.get('/', (req, res) => {
    res.send('API is running...');
})

app.use('/api/users', userRoutes);

// Function to start the server: -> 
const startServer = async () => {
    try {
        // This is the key line!
        // { alter: true } checks the current state of the database and then
        // performs the necessary changes in the tables to make it match the models.
        await sequelize.sync({ alter: true });
        console.log("All Models are synchronized completely...");
        // Start the server only after syncing is complete
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });

    } catch (error) {
        console.log("Unable to synchronize model with database: -> ", error);
    }
}

startServer();