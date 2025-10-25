import express from 'express';
import { addTrain } from '../controllers/trainController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, addTrain);

export default router;