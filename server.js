// app.js
const express = require('express')
const { loadSchema } = require('./models/dbModel')
const dbRoutes = require('./routes/dbRoutes')

require('dotenv').config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 5000

loadSchema() // Call the loadSchema function during server startup

app.use('/api', dbRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
