const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument to print phonebook records')
    console.log('Give password name number as argument to add person to phonebook')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://Myricks:${password}@cluster0.gy6p5.mongodb.net/Phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(() => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

