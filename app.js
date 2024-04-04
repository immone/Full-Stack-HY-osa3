const namesRouter = require('./controllers/names')
const express = require('express')
const config = require('./utils/config')
const { response } = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
    
  })

morgan.token('host', function(request, response) {
    return JSON.stringify(request.body)
})
  
app.use(morgan(':url :status :res[content-length] - :response-time ms :host'))
  

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use('/api/persons', namesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app