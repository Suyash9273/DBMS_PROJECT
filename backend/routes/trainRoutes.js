import express from 'express';
import { addTrain, searchTrains } from '../controllers/trainController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, addTrain);

// Public route to search for trains
router.get('/search', searchTrains); 

export default router;