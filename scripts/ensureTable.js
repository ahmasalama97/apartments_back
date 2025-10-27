import pool from "../db.js";

/**
 * Ensure a table exists. If not, create it dynamically.
 * @param {string} tableName - The table name
 * @param {object} columns - Columns definition (key: name, value: SQL type)
 */
export const ensureTable = async (tableName, columns) => {
    try {
        // 1. Check if table exists
        const checkQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = $1
            );
        `;
        const checkResult = await pool.query(checkQuery, [tableName]);
        const exists = checkResult.rows[0].exists;

        if (exists) {
            console.log(`✅ Table "${tableName}" already exists.`);
            return;
        }

        // 2. Build CREATE TABLE SQL dynamically
        const cols = Object.entries(columns)
            .map(([name, type]) => `${name} ${type}`)
            .join(", ");

        const createQuery = `CREATE TABLE ${tableName} (${cols});`;

        await pool.query(createQuery);
        console.log(`🚀 Table "${tableName}" created successfully.`);
    } catch (err) {
        console.error(`❌ Error ensuring table ${tableName}:`, err.message);
    }
};
