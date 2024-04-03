require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
};

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

app.use(express.json());
//app.use(morgan('tiny'));
app.use(express.static('dist'));
app.use(cors());
app.use(morgan(':method :url :status :response-time ms :body'));


// Resource
let persons = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
];


//Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World, I am ready to code!</h1>');
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    // name and number are required
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }
    // check if name already exists
    const nameExists = persons.find(person => person.name === body.name);
    if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    const person = {
        // random id
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    };
    persons = persons.concat(person);
    res.json(person);
  
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
