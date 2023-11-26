const { Pool } = require('pg')

// Load environment variables from a '.env' file
require('dotenv').config()

// Retrieve database connection details from environment variables
const USER = process.env.DB_USER        // Database user
const HOST = process.env.DB_HOST        // Database host
const DATABASE = process.env.DB_DATABASE // Database name
const PASSWORD = process.env.DB_PASSWORD // Database password
const PORT = process.env.DB_PORT         // Database port

// Create a new instance of the 'Pool' class with the provided connection details
const pool = new Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
})

module.exports = pool
