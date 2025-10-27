import dotenv from 'dotenv';
import { Client } from 'pg';
import { ensureTable } from './ensureTable.js';

dotenv.config();

const {
    PGUSER,
    PGPASSWORD,
    PGHOST = 'localhost',
    PGPORT = 5432,
    PGDATABASE
} = process.env;

if (!PGDATABASE) {
    console.error('❌ PGDATABASE is not set in .env. Set PGDATABASE to the desired database name.');
    process.exit(1);
}

async function createDatabaseIfNotExists() {
    // Connect to the default 'postgres' database to run CREATE DATABASE
    const adminClient = new Client({
        user: PGUSER,
        password: PGPASSWORD,
        host: PGHOST,
        port: PGPORT,
        database: 'postgres'
    });

    try {
        await adminClient.connect();

        const checkRes = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [PGDATABASE]);
        if (checkRes.rowCount > 0) {
            console.log(`✅ Database "${PGDATABASE}" already exists.`);
        } else {
            try {
                // CREATE DATABASE cannot be parameterized, ensure name is a simple identifier
                await adminClient.query(`CREATE DATABASE "${PGDATABASE.replace(/"/g, '')}"`);
                console.log(`🚀 Database "${PGDATABASE}" created successfully.`);
            } catch (err) {
                console.error('❌ Failed to create database. You may not have permission to create databases with the provided credentials.');
                console.error(err.message);
                process.exit(1);
            }
        }
    } catch (err) {
        console.error('❌ Error checking/creating database:', err.message);
        process.exit(1);
    } finally {
        await adminClient.end();
    }
}

async function ensureEverything() {
    await createDatabaseIfNotExists();

    // Now ensure the apartments table exists (ensureTable uses the pool configured for PGDATABASE)
    const columns = {
        id: 'SERIAL PRIMARY KEY',
        title: "VARCHAR(255) NOT NULL",
        description: 'TEXT',
        price: 'DECIMAL(10,2) NOT NULL',
        location: "VARCHAR(255) NOT NULL",
        bedrooms: 'INTEGER NOT NULL DEFAULT 0',
        bathrooms: 'INTEGER NOT NULL DEFAULT 0',
        project: "VARCHAR(255) NOT NULL DEFAULT ''",
        image_url: 'TEXT',
        created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    };

    try {
        await ensureTable('apartments', columns);
    } catch (err) {
        console.error('❌ Error ensuring apartments table:', err.message);
        process.exit(1);
    }

    console.log('✅ Database initialization complete.');
}

ensureEverything()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });