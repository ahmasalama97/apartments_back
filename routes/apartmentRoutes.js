import express from 'express';
import apartmentController from '../controllers/apartmentController.js';
import { handleApartmentUpload } from '../middlewares/uploadHandler.js';

const router = express.Router();

// GET /api/apartments - Get all apartments
router.get('/', apartmentController.getAllApartments);

// POST /api/apartments - Create new apartment with image upload
router.post('/', handleApartmentUpload, apartmentController.createApartment);


// GET /api/apartments/:id - Get apartment by ID
router.get('/:id', apartmentController.getApartmentById);

// (No generic 405 handlers here — leave method validation to route definitions)

export default router;