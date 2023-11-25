const { Pool } = require('pg')
require('dotenv').config()

const USER = process.env.DB_USER ;
const HOST = process.env.DB_HOST ;
const DATABASE = process.env.DB_DATABASE ;
const PASSWORD = process.env.DB_PASSWORD ;
const PORT = process.env.DB_PORT ;

const pool = new Pool({
    user: USER,
    host: HOST,
    database: DATABASE,
    password: PASSWORD,
    port: PORT,
})

module.exports = pool
