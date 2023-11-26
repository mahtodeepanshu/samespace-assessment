const express = require('express')
const { loadSchema } = require('./models/dbModel')
const dbRoutes = require('./routes/dbRoutes')

// Load environment variables from a '.env' file
require('dotenv').config()

const app = express()
app.use(express.json())

// Set the port number for the server, defaulting to 5000 if not provided
const PORT = process.env.PORT || 5000

// Call the 'loadSchema' function during server startup to initialize the database schema
loadSchema()

// Use the 'dbRoutes' module to handle API routes under the '/api' endpoint
app.use('/api', dbRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
