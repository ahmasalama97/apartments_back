import { Client } from "pg";

const client = new Client({
    user: "postgres",      // superuser
    password: "your_pg_password",
    host: "localhost",
    port: 5432,
    database: "postgres",  // connect to default db first
});

async function createDB() {
    try {
        await client.connect();

        // create the new database
        await client.query(`CREATE DATABASE doctors_reservation_db OWNER ecommerce_user`);

        console.log("✅ Database created successfully!");
    } catch (err) {
        console.error("❌ Error creating database:", err.message);
    } finally {
        await client.end();
    }
}

createDB();
