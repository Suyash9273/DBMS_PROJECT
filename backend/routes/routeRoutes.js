import express from 'express';
import { addRoute } from '../controllers/routeController.js';
import {protect, admin} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Route for adding a new 'route(schedule)'
router.route('/').post(protect, admin, addRoute);

export default router;