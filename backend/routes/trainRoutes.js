import express from 'express';
import { addTrain, searchTrains, getTrainById } from '../controllers/trainController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Only Admin can add trains
router.route('/').post(protect, admin, addTrain);

// Public route to search for trains
router.get('/search', searchTrains); 

// Public route to get a single train by ID
router.get('/:id', getTrainById); 

export default router;