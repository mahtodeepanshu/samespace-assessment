// controllers/DBController.js
const pool = require('../config/db');
const { tableExists, getTableColumns, addColumnsToTable } = require('../models/dbModel');

const createRecord = async (req, res) => {
  try {
    const { collection } = req.params
    const data = req.body

    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    } 

    const existingColumns = await getTableColumns(collection)
    
    // Check if each key in the data exists as a column
    const nonExistingColumns = Object.keys(data).filter((key) => !existingColumns.includes(key))

    // If there are non-existing columns, add them to the table
    if (nonExistingColumns.length > 0) {
      await addColumnsToTable(collection, nonExistingColumns)
    }

    const keys = Object.keys(data).join(', ')
    const values = Object.values(data).map(value => `'${value}'`).join(', ')

    const insertQuery = `INSERT INTO ${collection} (${keys}) VALUES (${values}) RETURNING *`

  
    const result = await pool.query(insertQuery)
    const insertedRow = result.rows[0]
    res.status(201).json({ id: insertedRow.id, ...data })
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

const getRecord = async (req, res) => {
  const { collection, id } = req.params

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    } 

    const query = `SELECT * FROM ${collection} WHERE id = ${id}`
    const result = await pool.query(query)

    if (result.rows.length === 0) {
      res.status(404).send('Not Found')
    } else {
      res.json(result.rows[0])
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send(err.message)
  }
}

const updateRecord = async (req, res) => {
  const { collection, id } = req.params
  const data = req.body

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    } 
    
    console.log('before')
    // Check for existing columns
    const existingColumns = await getTableColumns(collection)
    
    console.log('gotexistingcols')
    // Check if each key in the data exists as a column
    const nonExistingColumns = Object.keys(data).filter((key) => !existingColumns.includes(key))
    console.log('gotnonexistingcols')

    // If there are non-existing columns, add them to the table
    if (nonExistingColumns.length > 0) {
      await addColumnsToTable(collection, nonExistingColumns)
    }

    const updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ')
    const query = `UPDATE ${collection} SET ${updates} WHERE id = ${id} RETURNING *`
    const result = await pool.query(query)

    if (result.rows.length === 0) {
      res.status(404).send('Not Found')
    } else {
      res.json(result.rows[0])
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
}

const deleteRecord = async (req, res) => {
  const { collection, id } = req.params

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    } 
    
    const query = `DELETE FROM ${collection} WHERE id = ${id} RETURNING *`
    const result = await pool.query(query)

    if (result.rows.length === 0) {
      res.status(404).send('Not Found')
    } else {
      res.json(result.rows[0])
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
} 

module.exports = {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord
}
