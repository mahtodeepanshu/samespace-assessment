// routes/DBRoutes.js
const express = require('express')
const { createRecord, 
        getRecord, 
        updateRecord, 
        deleteRecord
} = require('../controllers/dbController')

const router = express.Router()

router.route('/:collection')
        .post(createRecord)
router.route('/:collection/:id')
        .get(getRecord)
router.route('/:collection/:id')
        .post(updateRecord)
router.route('/:collection/:id')
        .delete(deleteRecord)

module.exports = router