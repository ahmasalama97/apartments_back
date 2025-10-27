import db from '../db.js';

async function createApartmentsTable() {
    const client = await db.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS apartments (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                location VARCHAR(255) NOT NULL,
                bedrooms INTEGER NOT NULL DEFAULT 0,
                bathrooms INTEGER NOT NULL DEFAULT 0,
                project VARCHAR(255) NOT NULL DEFAULT '',
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Apartments table created successfully');
    } catch (error) {
        console.error('❌ Error creating apartments table:', error);
        throw error;
    } finally {
        client.release();
    }
}

createApartmentsTable()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });