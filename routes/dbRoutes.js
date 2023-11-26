// Import the 'express' library and the controller functions for database operations
const express = require('express')
const { createRecord, getRecord, updateRecord, deleteRecord } = require('../controllers/dbController')

const router = express.Router()

// Define routes for creating, reading, updating, and deleting records in a collection
router.route('/:collection')
  .post(createRecord) // Endpoint for creating a new record in the specified collection

router.route('/:collection/:id')
  .get(getRecord)      // Endpoint for retrieving a record from the specified collection by ID

router.route('/:collection/:id')
  .post(updateRecord)  // Endpoint for updating a record in the specified collection by ID

router.route('/:collection/:id')
  .delete(deleteRecord) // Endpoint for deleting a record from the specified collection by ID

// Export the router for use in other modules
module.exports = router
