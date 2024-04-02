const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://anttiimm1n:${password}@cluster0.yfnfldl.mongodb.net/nameApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const nameSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Name = mongoose.model('Name', nameSchema)

if (process.argv.length === 3){
    Name.find({}).then(result => {
        result.forEach(name => {
          console.log(name)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]
    const nameEntity = new Name({
        name: name,
        number: number
      })
    nameEntity.save().then(result =>  {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}

