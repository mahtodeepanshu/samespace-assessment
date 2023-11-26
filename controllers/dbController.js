// Import the database connection pool and functions for schema-related operations
const pool = require('../config/db')
const { tableExists, getTableColumns, addColumnsToTable } = require('../models/dbModel')

// Controller function for creating a new record in the specified collection
const createRecord = async (req, res) => {
  const { collection } = req.params
  const data = req.body
  
  try {
    
    // Check if the table for the collection exists
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    } 

    // Start a transaction
    const client = await pool.connect()
    await client.query('BEGIN')
    try{

      // Retrieve existing columns in the table
      const existingColumns = await getTableColumns(collection)
      
      // Check if each key in the data exists as a column
      // Extract non-existing columns along with their types
      const nonExistingColumns = Object.keys(data).filter((key) => !existingColumns.includes(key))
      
      // If there are non-existing columns, add them to the table
      if (nonExistingColumns.length > 0) {
        await addColumnsToTable(collection, nonExistingColumns)
      }
      
      // Construct and execute the SQL query for inserting a new record
      const keys = Object.keys(data).join(', ')
      const values = Object.values(data).map(value => `'${value}'`).join(', ')
      const insertQuery = `INSERT INTO ${collection} (${keys}) VALUES (${values}) RETURNING *`
      const result = await client.query(insertQuery)

      // Commit the transaction if all queries succeed
      await client.query('COMMIT')

      // Respond with the inserted record details
      const insertedRow = result.rows[0]
      res.status(201).json({ id: insertedRow.id, ...data })
    
    } catch (error) {

      // Rollback the transaction if any query fails
      await client.query('ROLLBACK')
      throw error // Re-throw the error for global error handling
    
    } finally {
      // Release the client back to the connection pool
      client.release()
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

// Controller function for retrieving a record from the specified collection by ID
const getRecord = async (req, res) => {
  const { collection, id } = req.params

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    }

    // Start a transaction (read-only in this case)
    const client = await pool.connect()
    await client.query('BEGIN')

    try {
      const query = `SELECT * FROM ${collection} WHERE id = ${id}`
      const result = await client.query(query)

      // Commit the read-only transaction
      await client.query('COMMIT')

      // Respond with the retrieved record or a 'Not Found' message
      if (result.rows.length === 0) {
        res.status(404).send('Not Found')
      } else {
        res.json(result.rows[0])
      }
    } catch (error) {
      // Rollback the transaction if any query fails
      await client.query('ROLLBACK')
      throw error // Re-throw the error for global error handling
    } finally {
      // Release the client back to the connection pool
      client.release()
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
}

// Controller function for updating a record in the specified collection by ID
const updateRecord = async (req, res) => {
  const { collection, id } = req.params
  const data = req.body

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    }

    // Start a transaction
    const client = await pool.connect()
    await client.query('BEGIN')

    try {
      // Check for existing columns in the table
      const existingColumns = await getTableColumns(collection)

      // Check if each key in the data exists as a column
      const nonExistingColumns = Object.keys(data).filter((key) => !existingColumns.includes(key))
      
      // If there are non-existing columns, add them to the table
      if (nonExistingColumns.length > 0) {
        await addColumnsToTable(collection, nonExistingColumns)
      }

      // Construct and execute the SQL query for updating a record by ID
      const updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ')
      const query = `UPDATE ${collection} SET ${updates} WHERE id = ${id} RETURNING *`
      const result = await client.query(query)

      // Commit the transaction if all queries succeed
      await client.query('COMMIT')

      // Respond with the updated record or a 'Not Found' message
      if (result.rows.length === 0) {
        res.status(404).send('Not Found')
      } else {
        res.json(result.rows[0])
      }
    } catch (error) {
      // Rollback the transaction if any query fails
      await client.query('ROLLBACK')
      throw error // Re-throw the error for global error handling
    } finally {
      // Release the client back to the connection pool
      client.release()
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
}

// Controller function for deleting a record from the specified collection by ID
const deleteRecord = async (req, res) => {
  const { collection, id } = req.params

  try {
    const tableExist = await tableExists(collection)
    if (!tableExist) {
      return res.status(404).send('Table Not Found')
    }

    // Start a transaction
    const client = await pool.connect()
    await client.query('BEGIN')

    try {
      const query = `DELETE FROM ${collection} WHERE id = ${id} RETURNING *`
      const result = await client.query(query)

      // Commit the transaction if all queries succeed
      await client.query('COMMIT')

      // Respond with the deleted record or a 'Not Found' message
      if (result.rows.length === 0) {
        res.status(404).send('Not Found')
      } else {
        res.json(result.rows[0])
      }
    } catch (error) {
    
      // Rollback the transaction if any query fails
      await client.query('ROLLBACK')
      throw error // Re-throw the error for global error handling
    
    } finally {

      // Release the client back to the connection pool
      client.release()
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Internal Server Error')
  }
} 

// Export the controller functions for use in the route handling
module.exports = {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord
}
