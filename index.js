require('dotenv').config()
const { response } = require('express')
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const app = express()
const Name = require('./models/name')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))


morgan.token('host', function(request, response) {
  return JSON.stringify(request.body)
})

app.use(morgan(':url :status :res[content-length] - :response-time ms :host'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const currentDate = Date(Date.now())
  Name.countDocuments({}).then( count => {
    console.log(count)
    response.send(`Phonebook has info for ${count} people
        <p> ${currentDate.toString()} <p/>`)
  })
})


app.get('/api/persons', (request, response) => {
  Name.find({}).then(names => {
    response.json(names)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Name.findById(request.params.id)
    .then(name => {
      if (name) {
        response.json(name)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Name.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedName => {
      response.json(updatedName)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const name = request.body

  if (!name || name.name === null || name.name === '') {
    response.status(404).json({ error: 'Name missing' })
  }
  else if (name.number === null || name.number === '') {
    response.status(404).json({ error: 'Number missing' })
    /*
    }
    else if (names.map(x => x.name).includes(name.name)) {
        response.status(404).json({error: 'Name must be unique'})
    */
  }
  else
  {
    // No longer needed, since MongoDB handles this (?)
    // const randomID = Math.floor(Math.random() * 5000)

    const newName = new Name({
      name: name.name,
      number: name.number
    })

    newName.save()
      .then(savedName => {
        response.json(savedName)
      })
      .catch(error => next(error))
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Name.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
