const express = require('express')
require('dotenv').config()

const app = express()

app.use(express.json())

const newsRoute = require('./src/routes/news.route')

app.use('/', newsRoute)

app.listen(process.env.DB_PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.DB_PORT}`)
})
