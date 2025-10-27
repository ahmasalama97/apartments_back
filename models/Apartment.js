import db from '../db.js';

class Apartment {
    static async findAll() {
        const query = 'SELECT * FROM apartments ORDER BY id DESC';
        try {
            const client = await db.connect();
            const { rows } = await client.query(query);
            client.release();
            return rows;
        } catch (error) {
            console.error('Database error:', error);
            // If table doesn't exist, return empty array instead of failing
            if (error && error.code === '42P01') {
                return [];
            }
            throw new Error('Error fetching apartments');
        }
    }

    static async findById(id) {
        const query = 'SELECT * FROM apartments WHERE id = $1';
        try {
            const client = await db.connect();
            const { rows } = await client.query(query, [id]);
            client.release();
            return rows[0];
        } catch (error) {
            console.error('Database error:', error);
            if (error && error.code === '42P01') {
                throw new Error('Apartments table does not exist. Run scripts/initDatabase.js');
            }
            throw new Error('Error fetching apartment');
        }
    }

    static async create(data) {
        const { title, description, price, location, bedrooms, bathrooms, project, image_url } = data;
        const query = `
            INSERT INTO apartments (title, description, price, location, bedrooms, bathrooms, project, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;
        try {
            const client = await db.connect();
            const values = [title, description, price, location, bedrooms, bathrooms, project, image_url];
            const { rows } = await client.query(query, values);
            client.release();
            return rows[0];
        } catch (error) {
            console.error('Database error:', error);
            if (error && error.code === '42P01') {
                throw new Error('Apartments table does not exist. Run scripts/initDatabase.js');
            }
            throw new Error('Error creating apartment');
        }
    }
}

export default Apartment;