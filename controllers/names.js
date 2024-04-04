const namesRouter = require('express').Router()
const Name = require('../models/name')

/*
namesRouter.get('/', (request, response) => {
    Name.find({}).then(notes => {
        response.json(notes)
      })
})
*/
  
namesRouter.get('/info', (request, response) => {
    const currentDate = Date(Date.now())
    Name.countDocuments({}).then( count => {
      console.log(count)
      response.send(`Phonebook has info for ${count} people
          <p> ${currentDate.toString()} <p/>`)
    })
})
  
  
namesRouter.get('/', (request, response) => {
    Name.find({}).then(names => {
      response.json(names)
    })
})
  
namesRouter.get('/:id', (request, response, next) => {
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
  
namesRouter.put('/:id', (request, response, next) => {
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
  
namesRouter.post('/', (request, response, next) => {
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
  
namesRouter.delete('/:id', (request, response, next) => {
    Name.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

module.exports = namesRouter