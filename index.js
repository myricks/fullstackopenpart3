const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Person = require('./models/person.js');
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function getBody(req) {
    const body = req.body;
    console.log(body)
    if (Object.keys(body).length > 0) {
        return `{"name": "${body.name}", "number" : "${body.number}"}`
    }
    return "-";
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`);
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id);
    response.send(person);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

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
        console.log('person added to phone book');
        response.json(person);
    })

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`)
})