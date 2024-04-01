const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())


let names = [
    {   
        id: 1   ,
        name: 'Arto Hellas', 
        number: '040-123456' 
    },
    { 
        id: 2,  
        name: 'Ada Lovelace', 
        number: '39-44-5323523' 
    },
    {
        id: 3,
         name: 'Dan Abramov', 
         number: '12-43-234345' 
        },
    { 
        id: 4,
        name: 'Mary Poppendieck', 
        number: 
        '39-23-6423122' 
    }
  ]

app.get('/info', (request, response) => {
    const currentDate = Date(Date.now())
    response.send(`Phonebook has info for ${names.length} people
    <p> ${currentDate.toString()} <p/>`)
})

app.get('/api/persons', (request, response) => {
  response.json(names)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const name = names.find(name => name.id === id)
    if (name) {
        response.json(name)
      } else {
        response.status(404).end()
      }
    
  })

app.post('/api/persons', (request, response) => {
    const name = request.body
    const randomID = Math.floor(Math.random() * 5000)
    name.id = randomID
    names = names.concat(name)
    if (name.name === null || name.name === "") {
        response.status(404).send("Name missing")  
    } 
    else if (name.number === null || name.number === "") {
        response.status(404).send("Number missing")  
    }
    else if (names.map(x => x.name).includes(name.name)) {
        response.status(404).send("Name must be unique")  
    }
    else
    {
        response.json(names)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    names = names.filter(note => note.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})