// models/DBModel.js
const pool = require('../config/db')
const fs = require('fs')

const loadSchema = async () => {
  try {
    const schemaFile = fs.readFileSync('./models/schema.json', 'utf8')
    const schema = JSON.parse(schemaFile)

    Object.keys(schema).forEach(async (collection) => {
      const tableInfo = schema[collection]
      const columns = tableInfo.columns.map(column => {
        const primaryKey = column.primaryKey ? 'PRIMARY KEY' : ''
        return `${column.name} ${column.type} ${primaryKey}`
      })

      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableInfo.name} (${columns.join(', ')})`

      await pool.query(createTableQuery)
    })

    console.log('Schema loaded successfully.')
  } catch (error) {
    console.error('Error loading schema:', error.message)
  }
}

const tableExists = async (tableName) => {
  const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`, [tableName])
  return result.rows[0].exists
}

const getTableColumns = async (tableName) => {
  const getColumnsQuery = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}'`
  const result = await pool.query(getColumnsQuery)
  return result.rows.map(row => row.column_name)
}

const addColumnsToTable = async (tableName, columns) => {
  for (const column of columns) {
    const alterTableQuery = `ALTER TABLE ${tableName} ADD COLUMN ${column} VARCHAR(255)`
    await pool.query(alterTableQuery)
  }
}

module.exports = { 
  loadSchema, 
  tableExists, 
  getTableColumns, 
  addColumnsToTable 
}
