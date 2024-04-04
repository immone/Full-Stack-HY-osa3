const mongoose = require('mongoose')

const nameSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (v) => {
        return /(\d{2}-\d{6,})|(\d{3}-\d{5,})/.test(v)
      },
      message: props => `${props.value} doesn't match the required form`
    }
  }
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