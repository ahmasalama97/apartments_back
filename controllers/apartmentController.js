import Apartment from '../models/Apartment.js';
import { ensureTable } from '../scripts/ensureTable.js';

const apartmentController = {
    // Get all apartments
    getAllApartments: async (req, res) => {
        try {
            try {
                await ensureTable("apartments", {
                    id: "SERIAL PRIMARY KEY",
                    title: "VARCHAR(255) NOT NULL",
                    description: "TEXT",
                    price: "DECIMAL(10,2) NOT NULL",
                    location: "VARCHAR(255) NOT NULL",
                    bedrooms: "INTEGER NOT NULL DEFAULT 0",
                    bathrooms: "INTEGER NOT NULL DEFAULT 0",
                    project: "VARCHAR(255) NOT NULL DEFAULT ''",
                    image_url: "TEXT",
                    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                });

            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
            const apartments = await Apartment.findAll();
            res.json(apartments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get apartment by ID
    getApartmentById: async (req, res) => {
        try {
            const { id } = req.params;
            const apartment = await Apartment.findById(id);

            if (!apartment) {
                return res.status(404).json({ message: 'Apartment not found' });
            }

            res.json(apartment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create new apartment
    createApartment: async (req, res) => {
        try {
            try {
                await ensureTable("apartments", {
                    id: "SERIAL PRIMARY KEY",
                    title: "VARCHAR(255) NOT NULL",
                    description: "TEXT",
                    price: "DECIMAL(10,2) NOT NULL",
                    location: "VARCHAR(255) NOT NULL",
                    bedrooms: "INTEGER NOT NULL DEFAULT 0",
                    bathrooms: "INTEGER NOT NULL DEFAULT 0",
                    project: "VARCHAR(255) NOT NULL DEFAULT ''",
                    image_url: "TEXT",
                    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                });
            } catch (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log('Received form data:', req.body);
            console.log('Received file:', req.file);

            // Check if request body exists
            if (!req.body) {
                return res.status(400).json({ error: "Request body is missing" });
            }

            // Get data from form data
            const title = req.body.title;
            const description = req.body.description;
            const price = req.body.price;
            const location = req.body.location;
            const bedrooms = req.body.bedrooms;
            const bathrooms = req.body.bathrooms;
            const project = req.body.project;

            // Get image path if file was uploaded
            let image_url = null;
            if (req.file) {
                image_url = `uploads/apartments/${req.file.filename}`;
            }            // Validate required fields
            if (!title || !price || !location) {
                return res.status(400).json({
                    error: "Missing required fields. Title, price, and location are required.",
                    received: { title, price, location }
                });
            }

            const apartmentData = {
                title,
                description: description || "",
                price: parseFloat(price),
                location,
                bedrooms: parseInt(bedrooms) || 0,
                bathrooms: parseInt(bathrooms) || 0,
                project: project || "",
                image_url: image_url || ""
            }; const newApartment = await Apartment.create(apartmentData);
            res.status(201).json(newApartment);
        } catch (error) {
            console.error('Error creating apartment:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default apartmentController;