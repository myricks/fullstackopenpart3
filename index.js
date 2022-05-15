const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
app.use(cors())

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

let persons = [
    {
        id: 1,
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
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
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
    const id = Math.floor(Math.random() * 50000000);
    const body = request.body;

    if (!body.name || !body.number) {
        response.status(400).json({
            error: 'Name or number is missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        response.status(400).json({
            error: 'Name is already in the phonebook'
        })
    }
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);
    response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`)
})