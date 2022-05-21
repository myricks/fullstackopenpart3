const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person.js')
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function getBody(req) {
    const body = req.body
    console.log(body)
    if (Object.keys(body).length > 0) {
        return `{"name": "${body.name}", "number" : "${body.number}"}`
    }
    return '-'
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            response.send(`<p>Phonebook has info for ${persons.length} people</p>
                <p>${Date()}</p>`)
        })

})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'Name or number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(person => {
        console.log('person added to phone book')
        response.json(person)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body


    Person.findByIdAndUpdate(request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Ei toimi' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`)
})