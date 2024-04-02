const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const password = process.argv[2]

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const nameSchema = new mongoose.Schema({
  name: String,
  number: Number
})

// transfers the db to match with our original backend
nameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Name', nameSchema)