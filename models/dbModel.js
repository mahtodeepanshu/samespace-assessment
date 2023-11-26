// Import the database connection pool and the 'fs' module for file system operations
const pool = require('../config/db')
const fs = require('fs')

// Function to load the database schema from a JSON file and create tables if not exist
const loadSchema = async () => {
  try {
    // Read the schema file and parse it as JSON
    const schemaFile = fs.readFileSync('./models/schema.json', 'utf8')
    const schema = JSON.parse(schemaFile)

    // Iterate over each collection in the schema
    Object.keys(schema).forEach(async (collection) => {
      const tableInfo = schema[collection]

      // Create column definitions with optional primary key constraint
      const columns = tableInfo.columns.map(column => {
        const primaryKey = column.primaryKey ? 'PRIMARY KEY' : ''
        return `${column.name} ${column.type} ${primaryKey}`
      })

      // Construct and execute the SQL query to create the table if not exists
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableInfo.name} (${columns.join(', ')})`
      await pool.query(createTableQuery)
    })

    console.log('Schema loaded successfully.')
  } catch (error) {
    console.error('Error loading schema:', error.message)
  }
}

// Function to check if a table with the given name exists in the database
const tableExists = async (tableName) => {
  const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`, [tableName])
  return result.rows[0].exists
}

// Function to retrieve column names for a given table
const getTableColumns = async (tableName) => {
  const getColumnsQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`
  const result = await pool.query(getColumnsQuery)
  return result.rows.map(row => row.column_name)
}

// Function to add columns to a table if they do not exist
const addColumnsToTable = async (tableName, columns) => {
  for (const column of columns) {
    const alterTableQuery = `ALTER TABLE ${tableName} ADD COLUMN ${column} VARCHAR(255)`
    await pool.query(alterTableQuery)
  }
}

// Export the functions for use in other modules
module.exports = { 
  loadSchema, 
  tableExists, 
  getTableColumns, 
  addColumnsToTable 
}
